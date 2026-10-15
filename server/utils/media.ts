import { randomUUID } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { MEDIA_BUCKET, MEDIA_MAX_BYTES, mediaTypes, isMediaComponent, isMediaPath, mediaFilename } from '../../shared/utils/media'
import { validateLogoSvg } from './svg'

export async function uploadMedia(client: SupabaseClient, component: string, name: string, type: string, body: Buffer) {
  if (!isMediaComponent(component) || !mediaTypes[type]) {
    throw createError({ statusCode: 400, data: { message: 'Укажите компонент и поддерживаемый формат изображения.' } })
  }
  if (!body.length || body.length > MEDIA_MAX_BYTES) {
    throw createError({ statusCode: 400, data: { message: 'Изображение должно быть не больше 5 МБ.' } })
  }
  if (type === 'image/svg+xml') {
    try { body = Buffer.from(validateLogoSvg(body.toString('utf8'))) } catch (error) {
      throw createError({ statusCode: 400, data: { message: (error as Error).message } })
    }
  }
  const filename = mediaFilename(name, mediaTypes[type]!)
  // Each revision gets its own object: concurrent saves never overwrite the published file.
  const path = `${component}/${filename.replace(/\.[^.]+$/, '')}-${randomUUID()}.${mediaTypes[type]}`
  const { error } = await client.storage.from(MEDIA_BUCKET).upload(path, body, { contentType: type, upsert: false, cacheControl: '31536000' })
  if (error) throw createError({ statusCode: 502, data: { message: 'Не удалось загрузить файл в Storage. Проверьте bucket Media.' } })
  return { path, filename }
}

export async function removeMedia(client: SupabaseClient, paths: string[]) {
  if (!paths.length) return
  if (paths.some(path => !isMediaPath(path))) throw createError({ statusCode: 400, statusMessage: 'Invalid media path' })
  const { error } = await client.storage.from(MEDIA_BUCKET).remove(paths)
  if (error) throw createError({ statusCode: 502, data: { message: 'Не удалось удалить файл из Storage. Повторите сохранение.' } })
}
