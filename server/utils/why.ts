import type { WhySettings } from '../../shared/types/why'
import { sortWhyCards } from '../../shared/utils/why'
export function serializeWhy(row: Record<string, unknown>): WhySettings {
  return { cards: sortWhyCards(row.cards as WhySettings['cards']), revision: Number(row.revision), updatedAt: row.updated_at as string,
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0 }
}
