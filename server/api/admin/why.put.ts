import { whyInputSchema } from '../../../shared/utils/why'
import type { WhyCard } from '../../../shared/types/why'

export default defineContentMutationHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const parsed = whyInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  let validated
  try {
    validated = parsed.data.cards.map((benefit, index) => {
      try { return { ...benefit, svg: benefit.svg ? validateLogoSvg(benefit.svg) : '' } } catch (e) {
        throw new Error(`Карточка ${index + 1}: ${(e as Error).message}`)
      }
    })
  } catch (e) { throw createError({ statusCode: 400, data: { message: (e as Error).message } }) }
  const conflict = () => createError({ statusCode: 409, data: { message: 'Карточки уже изменены. Загрузите актуальную версию перед сохранением.' } })
  const { data: previous, error: readError } = await client.from('site_why').select('*').eq('id', 'main').single()
  if (readError || !previous) throw createError({ statusCode: 503, data: { message: 'Не удалось загрузить карточки. Проверьте миграцию базы данных.' } })
  if (Number(previous.revision) !== parsed.data.revision) throw conflict()

  const oldItems = previous.cards as WhyCard[]
  const uploaded: string[] = []
  const items: WhyCard[] = []
  async function rollbackUploads() {
    try { await removeMedia(client, uploaded) } catch (error) { console.error('Unable to clean up unpublished Why icons', error) }
  }
  try {
    for (const benefit of validated) {
      const old = oldItems.find(item => item.id === benefit.id)
      let iconPath = old?.iconPath ?? null
      let iconFilename = benefit.iconFilename || old?.iconFilename || `${benefit.id}.svg`
      if (!benefit.svg) { iconPath = null; iconFilename = `${benefit.id}.svg` }
      else if (!iconPath || old?.svg !== benefit.svg || old?.iconFilename !== iconFilename) {
        const media = await uploadMedia(client, 'Why', iconFilename, 'image/svg+xml', Buffer.from(benefit.svg))
        uploaded.push(media.path); iconPath = media.path; iconFilename = media.filename
      }
      items.push({ ...benefit, iconPath, iconFilename })
    }
  } catch (error) { await rollbackUploads(); throw error }
  const newPaths = new Set(items.map(benefit => benefit.iconPath))
  const cleanup = [...new Set<string>([
    ...(previous.media_cleanup_paths as string[]),
    ...oldItems.flatMap(benefit => benefit.iconPath && !newPaths.has(benefit.iconPath) ? [benefit.iconPath] : [])
  ])]
  const { data, error } = await client.from('site_why').update({
    cards: items, media_cleanup_paths: cleanup, revision: parsed.data.revision + 1, updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision).select('*').maybeSingle()
  if (error || !data) {
    await rollbackUploads()
    if (error) throw createError({ statusCode: 500, data: { message: 'Не удалось сохранить карточки.' } })
    throw conflict()
  }
  if (cleanup.length) {
    try {
      await removeMedia(client, cleanup)
      const cleared = await client.from('site_why').update({ media_cleanup_paths: [] }).eq('id', 'main').eq('revision', data.revision)
      if (!cleared.error) data.media_cleanup_paths = []
    } catch { /* Published settings remain valid. Retry cleanup on the next save. */ }
  }
  return serializeWhy(data)
})
