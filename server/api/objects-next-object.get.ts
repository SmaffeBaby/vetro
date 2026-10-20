export default defineEventHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_objects_next_object').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Objects NextObject unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return serializeServicesHelpCard(data)
})
