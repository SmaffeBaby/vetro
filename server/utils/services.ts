import type { ServicesSettings } from '../../shared/types/services'
import { sortServiceCards } from '../../shared/utils/services'
export function serializeServices(row: Record<string, unknown>): ServicesSettings {
  return { title: row.title as string, text: row.text as string, cards: sortServiceCards(row.cards as ServicesSettings['cards']),
    revision: Number(row.revision), updatedAt: row.updated_at as string,
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0 }
}
