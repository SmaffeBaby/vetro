export default definePublicContentHandler(async event => {
  const { data, error } = await serverSupabase(event).from('site_about_hero').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'About hero unavailable' })
  return serializeAboutHero(data)
})
