import { howWorkInputSchema, sortWorkCards } from '../../../shared/utils/how-work'
export default defineEventHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const parsed = howWorkInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  const { data, error } = await client.from('site_how_work').update({
    cards: sortWorkCards(parsed.data.cards), revision: parsed.data.revision + 1, updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision).select('*').maybeSingle()
  if (error) throw createError({ statusCode: 500, data: { message: 'Не удалось сохранить этапы работы. Проверьте подключение и миграцию базы данных.' } })
  if (!data) throw createError({ statusCode: 409, data: { message: 'Этапы работы уже изменены. Загрузите актуальную версию перед сохранением.' } })
  return serializeHowWork(data)
})
