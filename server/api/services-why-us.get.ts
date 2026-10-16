export default defineEventHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_services_why_us').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Services why us settings unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return serializeServicesWhyUs(data)
})
