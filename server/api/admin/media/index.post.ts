import { mediaUrl } from '../../../../shared/utils/media'

export default defineEventHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const parts = await readMultipartFormData(event)
  const component = parts?.find(part => part.name === 'component')?.data.toString('utf8') ?? ''
  const file = parts?.find(part => part.name === 'file')
  if (!file?.filename || !file.type) throw createError({ statusCode: 400, statusMessage: 'Image required' })
  const result = await uploadMedia(client, component, file.filename, file.type, file.data)
  return { ...result, url: mediaUrl(result.path) }
})
