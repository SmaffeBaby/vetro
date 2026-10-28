export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_objects_request_card').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Objects RequestCard unavailable' })
  return serializeServicesHelpCard(data)
})
