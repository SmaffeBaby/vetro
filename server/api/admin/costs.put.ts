import { costsInputSchema } from '../../../shared/utils/costs'
export default defineEventHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const parsed = costsInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  const { data, error } = await client.from('site_costs').update({
    fields: parsed.data.fields, button_label: parsed.data.buttonLabel, revision: parsed.data.revision + 1, updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision).select('*').maybeSingle()
  if (error) throw createError({ statusCode: 500, data: { message: 'Не удалось сохранить стоимость. Проверьте миграцию базы данных.' } })
  if (!data) throw createError({ statusCode: 409, data: { message: 'Списки уже изменены. Загрузите актуальную версию перед сохранением.' } })
  return serializeCosts(data)
})
