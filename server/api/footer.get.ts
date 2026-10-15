export default defineEventHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_footer').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Footer settings unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return serializeFooter(data)
})
