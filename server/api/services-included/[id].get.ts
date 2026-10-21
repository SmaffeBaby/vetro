import { createDefaultServicesIncluded } from '../../../shared/config/default-services-included'

export default defineEventHandler(async event => {
  const client = serverSupabase(event)
  const service = await requireServiceCard(client, getRouterParam(event, 'id'))
  const { data, error } = await client.from('site_services_included').select('*').eq('service_id', service.id).maybeSingle()
  if (error) throw createError({ statusCode: 503, statusMessage: 'Service contents unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return data ? serializeServicesIncluded(data) : createDefaultServicesIncluded(service.id)
})
