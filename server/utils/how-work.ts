import type { HowWorkSettings } from '../../shared/types/how-work'
import { sortWorkCards } from '../../shared/utils/how-work'
export function serializeHowWork(row: Record<string, unknown>): HowWorkSettings {
  return { cards: sortWorkCards(row.cards as HowWorkSettings['cards']), revision: Number(row.revision), updatedAt: row.updated_at as string }
}
