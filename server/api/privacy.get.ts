export default definePublicContentHandler(async event => {
  const { data, error } = await serverSupabase(event).from('site_privacy').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Privacy policy unavailable' })
  return serializePrivacy(data)
})
