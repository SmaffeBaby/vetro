import type { AboutHistorySettings } from '../../shared/types/about-history'
export function serializeAboutHistory(row: Record<string, unknown>): AboutHistorySettings {
  return { title: row.title as string, cards: row.cards as AboutHistorySettings['cards'], revision: Number(row.revision), updatedAt: row.updated_at as string }
}
