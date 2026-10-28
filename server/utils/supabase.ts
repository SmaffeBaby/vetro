import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

let cachedClient: SupabaseClient | undefined
let cachedUrl = ''
let cachedKey = ''

export function serverSupabase(event: H3Event) {
  const config = useRuntimeConfig(event)
  if (!config.supabaseServiceRoleKey) {
    throw createError({ statusCode: 503, statusMessage: 'Supabase is not configured' })
  }
  if (!cachedClient || cachedUrl !== config.supabaseUrl || cachedKey !== config.supabaseServiceRoleKey) {
    cachedClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    })
    cachedUrl = config.supabaseUrl
    cachedKey = config.supabaseServiceRoleKey
  }
  return cachedClient
}
