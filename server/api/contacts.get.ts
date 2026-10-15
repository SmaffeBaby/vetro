export default defineEventHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_contacts').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Contacts settings unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return serializeContacts(data)
})
