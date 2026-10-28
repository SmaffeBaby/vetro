export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_services').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Services settings unavailable' })
  return serializeServices(data)
})
