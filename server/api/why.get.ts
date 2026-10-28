export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_why').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Why settings unavailable' })
  return serializeWhy(data)
})
