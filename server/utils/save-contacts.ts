import type { H3Event } from 'h3'
import { contactsInputSchema, sortContacts } from '../../shared/utils/contacts'
import type { ContactItem, ContactSocial } from '../../shared/types/contacts'
import { defaultContactsPage } from '../../shared/config/default-contacts'

export async function saveContactsSettings(event: H3Event, kind: 'home' | 'page' = 'home') {
  const table = kind === 'page' ? 'site_contacts_page' : 'site_contacts'
  const directory = kind === 'page' ? 'ContactsPage' : 'Contacts'
  const { client } = await requireSiteAdmin(event)
  const parsed = contactsInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  let validated
  let socials: ContactSocial[]
  try {
    validated = sortContacts(parsed.data.items.map((contact, index) => {
      try { return { ...contact, svg: contact.svg ? validateLogoSvg(contact.svg) : '' } } catch (e) {
        throw new Error(`Контакт ${index + 1}: ${(e as Error).message}`)
      }
    }))
    socials = parsed.data.page.socials.map(social => ({ ...social, svg: social.svg ? validateLogoSvg(social.svg) : '' }))
  } catch (e) { throw createError({ statusCode: 400, data: { message: (e as Error).message } }) }
  const conflict = () => createError({ statusCode: 409, data: { message: 'Контакты уже изменены. Загрузите актуальную версию перед сохранением.' } })
  const { data: previous, error: readError } = await client.from(table).select('*').eq('id', 'main').single()
  if (readError || !previous) throw createError({ statusCode: 503, data: { message: 'Не удалось загрузить контакты. Проверьте миграцию базы данных.' } })
  if (Number(previous.revision) !== parsed.data.revision) throw conflict()

  const oldItems = previous.items as ContactItem[]
  const oldSocials = previous.page?.socials as ContactSocial[] | undefined
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
        const media = await uploadMedia(client, directory, iconFilename, 'image/svg+xml', Buffer.from(contact.svg))
        uploaded.push(media.path); iconPath = media.path; iconFilename = media.filename
      }
      items.push({ ...contact, iconPath, iconFilename })
    }
    for (const social of socials) {
      const old = (oldSocials || defaultContactsPage.socials).find(item => item.id === social.id)
      social.iconPath = old?.iconPath ?? null
      if (!social.svg) { social.iconPath = null; social.iconFilename = `${social.id}.svg` }
      else if (!social.iconPath || social.svg !== old?.svg || social.iconFilename !== old?.iconFilename) {
        const media = await uploadMedia(client, directory, social.iconFilename, 'image/svg+xml', Buffer.from(social.svg))
        uploaded.push(media.path); social.iconPath = media.path; social.iconFilename = media.filename
      }
    }
  } catch (error) { await rollbackUploads(); throw error }
  const newPaths = new Set([...items, ...socials].map(contact => contact.iconPath))
  const cleanup = [...new Set<string>([
    ...(previous.media_cleanup_paths as string[]),
    ...[...oldItems, ...(oldSocials || [])].flatMap(contact => contact.iconPath && !newPaths.has(contact.iconPath) ? [contact.iconPath] : [])
  ])]
  const { data, error } = await client.from(table).update({
    items: items, page: { ...parsed.data.page, socials }, media_cleanup_paths: cleanup, revision: parsed.data.revision + 1, updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision).select('*').maybeSingle()
  if (error || !data) {
    await rollbackUploads()
    if (error) throw createError({ statusCode: 500, data: { message: 'Не удалось сохранить контакты.' } })
    throw conflict()
  }
  if (cleanup.length) {
    try {
      await removeMedia(client, cleanup)
      const cleared = await client.from(table).update({ media_cleanup_paths: [] }).eq('id', 'main').eq('revision', data.revision)
      if (!cleared.error) data.media_cleanup_paths = []
    } catch { /* Published settings remain valid. Retry cleanup on the next save. */ }
  }
  return serializeContacts(data)
}
