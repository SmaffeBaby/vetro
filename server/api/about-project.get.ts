export default defineEventHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_about_project').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Services HelpCard unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return serializeServicesHelpCard(data)
})
