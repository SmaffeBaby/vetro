import { createDefaultServiceDetail, serviceBreadcrumb } from '../../../shared/config/default-services-detail'
export default defineEventHandler(async (event) => {
  const client = serverSupabase(event)
  const card = await requireServiceCard(client, getRouterParam(event, 'id'))
  const { data, error } = await client.from('site_services_detail').select('*').eq('service_id', card.id).maybeSingle()
  if (error) throw createError({ statusCode: 503, statusMessage: 'Service detail unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return { ...(data ? serializeServiceDetail(data) : createDefaultServiceDetail(card)), breadcrumb: serviceBreadcrumb(card.title) }
})
