export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_costs').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Costs settings unavailable' })
  return serializeCosts(data)
})
