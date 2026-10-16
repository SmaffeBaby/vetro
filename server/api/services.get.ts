export default defineEventHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_services').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Services settings unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return serializeServices(data)
})
