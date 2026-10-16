import { servicesInputSchema, sortServiceCards } from '../../../shared/utils/services'
import type { ServiceCard } from '../../../shared/types/services'

export default defineEventHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const parsed = servicesInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  let validated
  try {
    validated = sortServiceCards(parsed.data.cards.map((card, index) => {
      try { return { ...card, svg: validateLogoSvg(card.svg) } } catch (e) {
        throw new Error(`Карточка ${index + 1}: ${(e as Error).message}`)
      }
    }))
  } catch (e) { throw createError({ statusCode: 400, data: { message: (e as Error).message } }) }
  const conflict = () => createError({ statusCode: 409, data: { message: 'Услуги уже изменены. Загрузите актуальную версию перед сохранением.' } })
  const { data: previous, error: readError } = await client.from('site_services').select('*').eq('id', 'main').single()
  if (readError || !previous) throw createError({ statusCode: 503, data: { message: 'Не удалось загрузить услуги. Проверьте миграцию базы данных.' } })
  if (Number(previous.revision) !== parsed.data.revision) throw conflict()

  const oldCards = previous.cards as ServiceCard[]
  const uploaded: string[] = []
  const cards: ServiceCard[] = []
  async function rollbackUploads() {
    try { await removeMedia(client, uploaded) } catch (error) { console.error('Unable to clean up unpublished Services icons', error) }
  }
  try {
    for (const card of validated) {
      const old = oldCards.find(item => item.id === card.id)
      let iconPath = old?.iconPath ?? null
      let iconFilename = card.iconFilename || old?.iconFilename || `${card.id}.svg`
      if (!iconPath || old?.svg !== card.svg || old?.iconFilename !== iconFilename) {
        const media = await uploadMedia(client, 'Services/Cards', iconFilename, 'image/svg+xml', Buffer.from(card.svg))
        uploaded.push(media.path); iconPath = media.path; iconFilename = media.filename
      }
      cards.push({ ...card, iconPath, iconFilename })
    }
  } catch (error) { await rollbackUploads(); throw error }
  const newPaths = new Set(cards.map(card => card.iconPath))
  const cleanup = [...new Set<string>([
    ...(previous.media_cleanup_paths as string[]),
    ...oldCards.flatMap(card => card.iconPath && !newPaths.has(card.iconPath) ? [card.iconPath] : [])
  ])]
  const { data, error } = await client.from('site_services').update({
    title: parsed.data.title, text: parsed.data.text, cards, media_cleanup_paths: cleanup, revision: parsed.data.revision + 1, updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision).select('*').maybeSingle()
  if (error || !data) {
    await rollbackUploads()
    if (error) throw createError({ statusCode: 500, data: { message: 'Не удалось сохранить услуги.' } })
    throw conflict()
  }
  if (cleanup.length) {
    try {
      await removeMedia(client, cleanup)
      const cleared = await client.from('site_services').update({ media_cleanup_paths: [] }).eq('id', 'main').eq('revision', data.revision)
      if (!cleared.error) data.media_cleanup_paths = []
    } catch { /* Published settings remain valid. Retry cleanup on the next save. */ }
  }
  return serializeServices(data)
})
