import type { H3Event } from 'h3'
import { servicesHelpCardInputSchema } from '../../shared/utils/services-help-card'

export async function saveContactCard(event: H3Event, config: { table: 'site_services_help_card' | 'site_objects_next_object' | 'site_objects_request_card'; mediaDirectory: 'Services/HelpCard' | 'Objects/NextObject' | 'Objects/RequestCard' }) {
  const { client } = await requireSiteAdmin(event)
  const parsed = servicesHelpCardInputSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid HelpCard settings', data: { message: parsed.error.issues[0]?.message } })
  }
  let svg = ''
  try { svg = parsed.data.svg ? validateLogoSvg(parsed.data.svg) : '' } catch (error) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid SVG', data: { message: (error as Error).message } })
  }
  const conflict = () => createError({ statusCode: 409, statusMessage: 'Settings changed', data: { message: 'Настройки уже изменились. Загрузите актуальную версию перед сохранением.' } })
  const { data: previous, error: readError } = await client.from(config.table).select('*').eq('id', 'main').single()
  if (readError || !previous) throw createError({ statusCode: 503, statusMessage: 'HelpCard settings unavailable' })
  if (Number(previous.revision) !== parsed.data.revision) throw conflict()

  let path: string | null = previous.image_path
  let filename = parsed.data.filename || previous.filename || 'logo.svg'
  const changed = svg !== previous.svg || filename !== previous.filename || (!!svg && !path)
  let uploaded: string | null = null
  if (changed) {
    if (svg) {
      const media = await uploadMedia(client, config.mediaDirectory, filename, 'image/svg+xml', Buffer.from(svg))
      path = uploaded = media.path
      filename = media.filename
    } else { path = null; filename = 'logo.svg' }
  }
  const cleanup: string[] = [...new Set<string>([
    ...(previous.media_cleanup_paths as string[]),
    ...(previous.image_path && path !== previous.image_path ? [previous.image_path as string] : [])
  ])]
  const { data, error } = await client.from(config.table).update({
    svg,
    image_path: path,
    filename,
    media_cleanup_paths: cleanup,
    title: parsed.data.title,
    text: parsed.data.text,
    button_label: parsed.data.buttonLabel,
    revision: parsed.data.revision + 1,
    updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision).select('*').maybeSingle()
  if (error || !data) {
    if (uploaded) {
      try { await removeMedia(client, [uploaded]) } catch (cleanupError) { console.error('Unable to clean up unpublished media', cleanupError) }
    }
    if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to save HelpCard' })
    throw conflict()
  }
  if (cleanup.length) {
    try {
      await removeMedia(client, cleanup)
      const { error: cleanupError } = await client.from(config.table).update({ media_cleanup_paths: [] })
        .eq('id', 'main').eq('revision', data.revision)
      if (!cleanupError) data.media_cleanup_paths = []
    } catch {
      // Settings are already published; report a retryable cleanup rather than losing the saved revision.
    }
  }
  return serializeServicesHelpCard(data)
}
