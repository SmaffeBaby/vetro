export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_contacts_page').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Contacts settings unavailable' })
  return serializeContacts(data)
})
