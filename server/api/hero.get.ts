export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_hero').select('*').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Hero settings unavailable' })
  return serializeHero(data)
})
