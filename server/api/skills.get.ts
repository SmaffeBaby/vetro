export default definePublicContentHandler(async (event) => {
  const { data, error } = await serverSupabase(event).from('site_skills').select('cards, revision, updated_at, media_cleanup_paths').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Skills settings unavailable' })
  return serializeSkills(data)
})
