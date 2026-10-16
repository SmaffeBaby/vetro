export default defineEventHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_how_work').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Work settings unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return serializeHowWork(data)
})
