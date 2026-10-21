export default defineEventHandler(async event => {
  const { data, error } = await serverSupabase(event).from('site_about_letters').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Appreciation letters unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return serializeAboutLetters(data)
})
