export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_license').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'License settings unavailable' })
  return serializeLicense(data)
})
