import { privacyInputSchema } from '../../../shared/utils/privacy'
export default defineContentMutationHandler(async event => {
  const { client } = await requireSiteAdmin(event)
  const parsed = privacyInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  const { revision, ...content } = parsed.data
  const { data, error } = await client.from('site_privacy').update({ content, revision: revision + 1, updated_at: new Date().toISOString() })
    .eq('id', 'main').eq('revision', revision).select('*').maybeSingle()
  if (error) throw createError({ statusCode: 503, data: { message: 'Не удалось сохранить политику конфиденциальности.' } })
  if (!data) throw createError({ statusCode: 409, data: { message: 'Политика уже изменена. Загрузите актуальную версию перед сохранением.' } })
  return serializePrivacy(data)
})
