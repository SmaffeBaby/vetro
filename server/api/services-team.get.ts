export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_services_team').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Services team settings unavailable' })
  return serializeServicesTeam(data)
})
