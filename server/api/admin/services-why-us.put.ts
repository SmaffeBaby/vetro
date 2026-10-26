import { servicesWhyUsInputSchema } from '../../../shared/utils/services-why-us'
export default defineEventHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const parsed = servicesWhyUsInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  const { data, error } = await client.from('site_services_why_us').update({
    title: parsed.data.title, cards: parsed.data.cards, metrics_title: parsed.data.metricsTitle, metrics: parsed.data.metrics, revision: parsed.data.revision + 1, updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision).select('*').maybeSingle()
  if (error) throw createError({ statusCode: 500, data: { message: 'Не удалось сохранить блок «Почему мы». Проверьте подключение и миграцию базы данных.' } })
  if (!data) throw createError({ statusCode: 409, data: { message: 'Блок «Почему мы» уже изменён. Загрузите актуальную версию перед сохранением.' } })
  return serializeServicesWhyUs(data)
})
