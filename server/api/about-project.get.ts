export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_about_project').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Services HelpCard unavailable' })
  return serializeServicesHelpCard(data)
})
