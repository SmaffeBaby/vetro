import { isMediaComponent, isMediaPath } from '../../../../shared/utils/media'

export default defineEventHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const { component, path } = await readBody(event)
  if (typeof component !== 'string' || !isMediaComponent(component) || typeof path !== 'string' || !isMediaPath(path) || !path.startsWith(`${component}/`)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid media path' })
  }
  // Published header objects are owned and removed by the header save workflow.
  if (component === 'License') throw createError({ statusCode: 409, data: { message: 'Удалите фото через настройки лицензии и сохраните изменения.' } })
  if (component === 'FAQ') throw createError({ statusCode: 409, data: { message: 'Удалите SVG через настройки вопросов и сохраните изменения.' } })
  if (component === 'Contacts') throw createError({ statusCode: 409, data: { message: 'Удалите SVG через настройки контактов и сохраните изменения.' } })
  if (component === 'Footer') throw createError({ statusCode: 409, data: { message: 'Удалите логотип через настройки футера и сохраните изменения.' } })
  if (component === 'Hero') throw createError({ statusCode: 409, data: { message: 'Удалите изображение через настройки Hero и сохраните изменения.' } })
  if (component === 'Header') throw createError({ statusCode: 409, data: { message: 'Удалите логотип через настройки хедера и сохраните изменения.' } })
  await removeMedia(client, [path])
  return { deleted: true }
})
