export default definePublicContentHandler(async event => {
  const { data, error } = await serverSupabase(event).from('site_not_found').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Not found settings unavailable' })
  return serializeNotFound(data)
})
