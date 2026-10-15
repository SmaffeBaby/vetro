export default defineEventHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_license').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'License settings unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return serializeLicense(data)
})
