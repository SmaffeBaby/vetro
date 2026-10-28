export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_how_work').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Work settings unavailable' })
  return serializeHowWork(data)
})
