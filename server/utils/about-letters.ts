import type { AboutLettersSettings } from '../../shared/types/about-letters'
export function serializeAboutLetters(row: Record<string, unknown>): AboutLettersSettings {
  return { title: row.title as string, cards: row.cards as AboutLettersSettings['cards'], revision: Number(row.revision), updatedAt: row.updated_at as string }
}
