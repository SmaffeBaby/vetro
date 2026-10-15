import { aboutCardInputSchema } from '../../../shared/utils/about-card'

export default defineEventHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const parsed = aboutCardInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  const { data, error } = await client.from('site_about_card').update({
    left_items: parsed.data.leftItems,
    center_text: parsed.data.centerText,
    right_items: parsed.data.rightItems,
    revision: parsed.data.revision + 1,
    updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision).select('*').maybeSingle()
  if (error) throw createError({ statusCode: 500, data: { message: 'Не удалось сохранить AboutCard. Проверьте подключение и миграцию базы данных.' } })
  if (!data) throw createError({ statusCode: 409, data: { message: 'AboutCard уже изменён. Загрузите актуальную версию перед сохранением.' } })
  return serializeAboutCard(data)
})
