export default defineEventHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_faq').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'FAQ settings unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return serializeFaq(data)
})
