export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_faq').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'FAQ settings unavailable' })
  return serializeFaq(data)
})
