import { isMediaComponent, isMediaPath, mediaDirectory } from '../../../../shared/utils/media'

export default defineEventHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const { component, path } = await readBody(event)
  if (typeof component !== 'string' || !isMediaComponent(component) || typeof path !== 'string' || !isMediaPath(path) || !(path.startsWith(`${mediaDirectory(component)}/`) || path.startsWith(`${component}/`))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid media path' })
  }
  const owned = new Set(['Objects/Gallery', 'Objects/RequestCard', 'Objects/NextObject', 'Objects/Photos', 'Header', 'Footer', 'Home/Hero', 'Home/Skills', 'Home/Contacts', 'Home/FAQ', 'Home/License', 'Home/Why', 'Services/Cards', 'Services/HelpCard', 'Services/DetailServices/HeroSevicesDetail', 'Services/DetailServices/RequestCard', 'Services/DetailServices/Team'])
  if (owned.has(mediaDirectory(component))) throw createError({ statusCode: 409, data: { message: 'Удалите изображение через настройки соответствующего раздела и сохраните изменения.' } })
  await removeMedia(client, [path])
  return { deleted: true }
})
