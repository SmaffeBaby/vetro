import { servicePricesInputSchema } from '../../../../shared/utils/services-prices'
export default defineEventHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const card = await requireServiceCard(client, getRouterParam(event, 'id'))
  const parsed = servicePricesInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  const conflict = () => createError({ statusCode: 409, data: { message: 'Прайс-лист уже изменён. Загрузите актуальную версию перед сохранением.' } })
  const { data: previous, error: readError } = await client.from('site_services_prices').select('*').eq('service_id', card.id).maybeSingle()
  if (readError) throw createError({ statusCode: 503, data: { message: 'Не удалось загрузить стоимость услуг. Проверьте подключение и миграцию базы данных.' } })
  if (Number(previous?.revision ?? 0) !== parsed.data.revision) throw conflict()
  const settings = { title: parsed.data.title, description: parsed.data.description, button_label: parsed.data.buttonLabel,
    rows: parsed.data.rows, revision: parsed.data.revision + 1, updated_at: new Date().toISOString() }
  const { data, error } = previous
    ? await client.from('site_services_prices').update(settings).eq('service_id', card.id).eq('revision', parsed.data.revision).select('*').maybeSingle()
    : await client.from('site_services_prices').insert({ ...settings, service_id: card.id }).select('*').maybeSingle()
  if (error?.code === '23505' || !error && !data) throw conflict()
  if (error) throw createError({ statusCode: 500, data: { message: 'Не удалось сохранить стоимость услуг.' } })
  return serializeServicePrices(data)
})
