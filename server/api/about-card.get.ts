export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_about_card').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'AboutCard settings unavailable' })
  return serializeAboutCard(data)
})
