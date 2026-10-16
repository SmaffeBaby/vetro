import type { ServicesWhyUsSettings } from '../../shared/types/services-why-us'
export function serializeServicesWhyUs(row: Record<string, unknown>): ServicesWhyUsSettings {
  return { title: row.title as string, cards: row.cards as ServicesWhyUsSettings['cards'], revision: Number(row.revision), updatedAt: row.updated_at as string }
}
