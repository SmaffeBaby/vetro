import { createDefaultServiceRequest } from '../../../shared/config/default-services-request'
export default defineEventHandler(async (event) => {
  const client = serverSupabase(event)
  const card = await requireServiceCard(client, getRouterParam(event, 'id'))
  const { data, error } = await client.from('site_services_request').select('*').eq('service_id', card.id).maybeSingle()
  if (error) throw createError({ statusCode: 503, statusMessage: 'Service request unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return data ? serializeServiceRequest(data) : createDefaultServiceRequest(card.id)
})
