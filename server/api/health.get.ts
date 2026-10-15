export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  try {
    await $fetch(`${config.supabaseUrl}/rest/v1/`, {
      headers: { apikey: config.supabaseServiceRoleKey }, timeout: 5000
    })
    return { ok: true, service: 'vetro', database: 'reachable' }
  } catch {
    setResponseStatus(event, 503)
    return { ok: false, service: 'vetro', database: 'unavailable' }
  }
})
