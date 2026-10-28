import { licenseInputSchema, licenseImageTypes } from '../../../shared/utils/license'

export default defineContentMutationHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const parts = await readMultipartFormData(event)
  let settings: unknown
  try { settings = JSON.parse(parts?.find(part => part.name === 'settings')?.data.toString('utf8') || '') } catch {
    throw createError({ statusCode: 400, data: { message: 'Некорректные настройки лицензии.' } })
  }
  const parsed = licenseInputSchema.safeParse(settings)
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  const file = parts?.find(part => part.name === 'image')
  if (file && (!file.filename || !file.type || parsed.data.removeImage)) {
    throw createError({ statusCode: 400, data: { message: 'Укажите изображение или его удаление.' } })
  }
  if (file && !licenseImageTypes.includes(file.type!)) throw createError({ statusCode: 400, data: { message: 'Выберите фото PNG, JPEG, WebP или AVIF.' } })
  const conflict = () => createError({ statusCode: 409, data: { message: 'Лицензия уже изменена. Загрузите актуальную версию перед сохранением.' } })
  const { data: previous, error: readError } = await client.from('site_license').select('*').eq('id', 'main').single()
  if (readError || !previous) throw createError({ statusCode: 503, data: { message: 'Не удалось загрузить лицензию. Проверьте миграцию базы данных.' } })
  if (Number(previous.revision) !== parsed.data.revision) throw conflict()

  let path: string | null = parsed.data.removeImage ? null : previous.image_path
  let filename: string = parsed.data.removeImage ? '' : previous.image_filename
  let uploaded: string | null = null
  if (file) {
    const media = await uploadMedia(client, 'License', file.filename!, file.type!, file.data)
    path = uploaded = media.path
    filename = media.filename
  }
  const cleanup = [...new Set<string>([
    ...(previous.media_cleanup_paths as string[]),
    ...(previous.image_path && path !== previous.image_path ? [previous.image_path as string] : [])
  ])]
  const { data, error } = await client.from('site_license').update({
    title: parsed.data.title, button_label: parsed.data.buttonLabel,
    image_path: path, image_filename: filename, media_cleanup_paths: cleanup,
    revision: parsed.data.revision + 1, updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision).select('*').maybeSingle()
  if (error || !data) {
    if (uploaded) {
      try { await removeMedia(client, [uploaded]) } catch (cleanupError) { console.error('Unable to clean up unpublished License image', cleanupError) }
    }
    if (error) throw createError({ statusCode: 500, data: { message: 'Не удалось сохранить лицензию.' } })
    throw conflict()
  }
  if (cleanup.length) {
    try {
      await removeMedia(client, cleanup)
      const { error: cleanupError } = await client.from('site_license').update({ media_cleanup_paths: [] }).eq('id', 'main').eq('revision', data.revision)
      if (!cleanupError) data.media_cleanup_paths = []
    } catch { /* Published settings remain valid; the admin can retry cleanup on the next save. */ }
  }
  return serializeLicense(data)
})
