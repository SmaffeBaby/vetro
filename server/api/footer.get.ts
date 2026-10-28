export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_footer').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Footer settings unavailable' })
  return serializeFooter(data)
})
