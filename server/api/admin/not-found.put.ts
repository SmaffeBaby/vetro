import { notFoundInputSchema } from '../../../shared/utils/not-found'

export default defineEventHandler(async event => {
  const { client } = await requireSiteAdmin(event)
  const parsed = notFoundInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  const { revision, ...content } = parsed.data
  const { data, error } = await client.from('site_not_found').update({ content, revision: revision + 1, updated_at: new Date().toISOString() })
    .eq('id', 'main').eq('revision', revision).select('*').maybeSingle()
  if (error) throw createError({ statusCode: 503, data: { message: 'Не удалось сохранить страницу 404.' } })
  if (!data) throw createError({ statusCode: 409, data: { message: 'Страница 404 уже изменена. Загрузите актуальную версию перед сохранением.' } })
  return serializeNotFound(data)
})
