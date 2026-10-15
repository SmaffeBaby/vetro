import { MEDIA_MAX_BYTES, mediaTypes, isMediaComponent, mediaUrl } from '#shared/utils/media'

/** Media/[component]/[filename]. Save ownership in the component's settings before removing its previous file. */
export function useMedia(component: string) {
  if (!isMediaComponent(component)) throw new Error('Некорректное имя компонента Media')
  const { adminFetch } = useAdminAuth()

  async function readFile(file: File, options: { svgOnly?: boolean } = {}) {
    const type = file.type || (/\.svg$/i.test(file.name) ? 'image/svg+xml' : '')
    if (!mediaTypes[type] || options.svgOnly && type !== 'image/svg+xml') throw new Error('Выберите поддерживаемое изображение.')
    if (!file.size || file.size > (type === 'image/svg+xml' ? 200_000 : MEDIA_MAX_BYTES)) {
      throw new Error(type === 'image/svg+xml' ? 'SVG должен быть меньше 200 КБ' : 'Изображение должно быть не больше 5 МБ')
    }
    return { name: file.name, type, text: type === 'image/svg+xml' ? await file.text() : '' }
  }

  async function upload(file: File) {
    await readFile(file)
    const body = new FormData()
    body.set('component', component)
    body.set('file', file)
    return adminFetch<{ path: string; filename: string; url: string }>('/api/admin/media', { method: 'POST', body })
  }

  async function remove(path: string) {
    return adminFetch('/api/admin/media', { method: 'DELETE', body: { component, path } })
  }

  return { readFile, upload, remove, url: mediaUrl }
}
