import type { ServiceDetailSettings } from '../../shared/types/services-detail'
import type { ServiceCard } from '../../shared/types/services'
import { serviceIdSchema } from '../../shared/utils/services-detail'
import type { SupabaseClient } from '@supabase/supabase-js'
export function serializeServiceDetail(row: Record<string, unknown>): ServiceDetailSettings {
  return { serviceId: row.service_id as string, title: row.title as string, text: row.text as string, buttonLabel: row.button_label as string,
    svg: row.svg as string, imagePath: (row.image_path as string | null) ?? null, filename: row.filename as string,
    revision: Number(row.revision), updatedAt: row.updated_at as string,
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0 }
}
export async function requireServiceCard(client: SupabaseClient, id: unknown): Promise<ServiceCard> {
  const parsed = serviceIdSchema.safeParse(id)
  if (!parsed.success) throw createError({ statusCode: 404, statusMessage: 'Service not found' })
  const { data, error } = await client.from('site_services').select('cards').eq('id', 'main').single()
  if (error || !data) throw createError({ statusCode: 503, statusMessage: 'Services unavailable' })
  const card = (data.cards as ServiceCard[]).find(card => card.id === parsed.data)
  if (!card) throw createError({ statusCode: 404, statusMessage: 'Service not found' })
  return card
}
