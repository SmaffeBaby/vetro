import { serviceIncludedInputSchema } from '../../../../shared/utils/services-included'

export default defineContentMutationHandler(async event => {
  const { client } = await requireSiteAdmin(event)
  const service = await requireServiceCard(client, getRouterParam(event, 'id'))
  const parsed = serviceIncludedInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid service contents', data: { message: parsed.error.issues[0]?.message } })
  const { revision, title, text, buttonLabel, items } = parsed.data
  const row = { title, text, button_label: buttonLabel, items, revision: revision + 1, updated_at: new Date().toISOString() }
  const { data, error } = revision === 0
    ? await client.from('site_services_included').insert({ ...row, service_id: service.id }).select('*').maybeSingle()
    : await client.from('site_services_included').update(row).eq('service_id', service.id).eq('revision', revision).select('*').maybeSingle()
  if (error?.code === '23505' || (!error && !data)) throw createError({ statusCode: 409, statusMessage: 'Contents changed', data: { message: 'Данные уже изменились. Загрузите актуальную версию перед сохранением.' } })
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Unable to save service contents' })
  return serializeServicesIncluded(data)
})
