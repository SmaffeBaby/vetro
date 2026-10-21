export default defineEventHandler(async event => {
  const { data, error } = await serverSupabase(event).from('site_privacy').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Privacy policy unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return serializePrivacy(data)
})
