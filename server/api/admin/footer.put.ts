import { footerInputSchema, sortFooterColumns } from '../../../shared/utils/footer'

export default defineContentMutationHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const parsed = footerInputSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid footer settings', data: { message: parsed.error.issues[0]?.message } })
  }
  let svg = ''
  try { svg = parsed.data.logoSvg ? validateLogoSvg(parsed.data.logoSvg) : '' } catch (error) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid SVG', data: { message: (error as Error).message } })
  }
  const conflict = () => createError({ statusCode: 409, statusMessage: 'Settings changed', data: { message: 'Настройки уже изменились. Загрузите актуальную версию перед сохранением.' } })
  const { data: previous, error: readError } = await client.from('site_footer').select('*').eq('id', 'main').single()
  if (readError || !previous) throw createError({ statusCode: 503, statusMessage: 'Footer settings unavailable' })
  if (Number(previous.revision) !== parsed.data.revision) throw conflict()

  let path: string | null = previous.logo_path
  let filename = parsed.data.logoFilename || previous.logo_filename || 'logo.svg'
  const changed = svg !== previous.logo_svg || filename !== previous.logo_filename || (!!svg && !path)
  let uploaded: string | null = null
  if (changed) {
    if (svg) {
      const media = await uploadMedia(client, 'Footer', filename, 'image/svg+xml', Buffer.from(svg))
      path = uploaded = media.path
      filename = media.filename
    } else { path = null; filename = 'logo.svg' }
  }
  const cleanup: string[] = [...new Set<string>([
    ...(previous.media_cleanup_paths as string[]),
    ...(previous.logo_path && path !== previous.logo_path ? [previous.logo_path as string] : [])
  ])]
  const { data, error } = await client.from('site_footer').update({
    logo_svg: svg,
    logo_path: path,
    logo_filename: filename,
    media_cleanup_paths: cleanup,
    text: parsed.data.text,
    columns: sortFooterColumns(parsed.data.columns),
    left_bottom: parsed.data.leftBottom,
    right_bottom: parsed.data.rightBottom,
    button_label: parsed.data.buttonLabel,
    revision: parsed.data.revision + 1,
    updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision).select('*').maybeSingle()
  if (error || !data) {
    if (uploaded) {
      try { await removeMedia(client, [uploaded]) } catch (cleanupError) { console.error('Unable to clean up unpublished media', cleanupError) }
    }
    if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to save footer' })
    throw conflict()
  }
  if (cleanup.length) {
    try {
      await removeMedia(client, cleanup)
      const { error: cleanupError } = await client.from('site_footer').update({ media_cleanup_paths: [] })
        .eq('id', 'main').eq('revision', data.revision)
      if (!cleanupError) data.media_cleanup_paths = []
    } catch {
      // Settings are already published; report a retryable cleanup rather than losing the saved revision.
    }
  }
  return serializeFooter(data)
})
