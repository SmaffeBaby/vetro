import { createDefaultServicePrices } from '../../../shared/config/default-services-prices'
export default defineEventHandler(async (event) => {
  const client = serverSupabase(event)
  const card = await requireServiceCard(client, getRouterParam(event, 'id'))
  const { data, error } = await client.from('site_services_prices').select('*').eq('service_id', card.id).maybeSingle()
  if (error) throw createError({ statusCode: 503, statusMessage: 'Service prices unavailable' })
  setHeader(event, 'Cache-Control', 'no-cache')
  return data ? serializeServicePrices(data) : createDefaultServicePrices(card.id)
})
