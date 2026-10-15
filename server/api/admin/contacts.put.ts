import { contactsInputSchema, sortContacts } from '../../../shared/utils/contacts'
import type { ContactItem } from '../../../shared/types/contacts'

export default defineEventHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const parsed = contactsInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  let validated
  try {
    validated = sortContacts(parsed.data.items.map((contact, index) => {
      try { return { ...contact, svg: contact.svg ? validateLogoSvg(contact.svg) : '' } } catch (e) {
        throw new Error(`Контакт ${index + 1}: ${(e as Error).message}`)
      }
    }))
  } catch (e) { throw createError({ statusCode: 400, data: { message: (e as Error).message } }) }
  const conflict = () => createError({ statusCode: 409, data: { message: 'Контакты уже изменены. Загрузите актуальную версию перед сохранением.' } })
  const { data: previous, error: readError } = await client.from('site_contacts').select('*').eq('id', 'main').single()
  if (readError || !previous) throw createError({ statusCode: 503, data: { message: 'Не удалось загрузить контакты. Проверьте миграцию базы данных.' } })
  if (Number(previous.revision) !== parsed.data.revision) throw conflict()

  const oldItems = previous.items as ContactItem[]
  const uploaded: string[] = []
  const items: ContactItem[] = []
  async function rollbackUploads() {
    try { await removeMedia(client, uploaded) } catch (error) { console.error('Unable to clean up unpublished Contacts icons', error) }
  }
  try {
    for (const contact of validated) {
      const old = oldItems.find(item => item.id === contact.id)
      let iconPath = old?.iconPath ?? null
      let iconFilename = contact.iconFilename || old?.iconFilename || `${contact.id}.svg`
      if (!contact.svg) { iconPath = null; iconFilename = `${contact.id}.svg` }
      else if (!iconPath || old?.svg !== contact.svg || old?.iconFilename !== iconFilename) {
        const media = await uploadMedia(client, 'Contacts', iconFilename, 'image/svg+xml', Buffer.from(contact.svg))
        uploaded.push(media.path); iconPath = media.path; iconFilename = media.filename
      }
      items.push({ ...contact, iconPath, iconFilename })
    }
  } catch (error) { await rollbackUploads(); throw error }
  const newPaths = new Set(items.map(contact => contact.iconPath))
  const cleanup = [...new Set<string>([
    ...(previous.media_cleanup_paths as string[]),
    ...oldItems.flatMap(contact => contact.iconPath && !newPaths.has(contact.iconPath) ? [contact.iconPath] : [])
  ])]
  const { data, error } = await client.from('site_contacts').update({
    items: items, media_cleanup_paths: cleanup, revision: parsed.data.revision + 1, updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision).select('*').maybeSingle()
  if (error || !data) {
    await rollbackUploads()
    if (error) throw createError({ statusCode: 500, data: { message: 'Не удалось сохранить контакты.' } })
    throw conflict()
  }
  if (cleanup.length) {
    try {
      await removeMedia(client, cleanup)
      const cleared = await client.from('site_contacts').update({ media_cleanup_paths: [] }).eq('id', 'main').eq('revision', data.revision)
      if (!cleared.error) data.media_cleanup_paths = []
    } catch { /* Published settings remain valid. Retry cleanup on the next save. */ }
  }
  return serializeContacts(data)
})
