import type { ServicesWhyUsSettings } from '../../shared/types/services-why-us'
import { defaultServicesWhyUs } from '../../shared/config/default-services-why-us.ts'
export function serializeServicesWhyUs(row: Record<string, unknown>): ServicesWhyUsSettings {
  return { metricsTitle: (row.metrics_title as string | undefined) ?? defaultServicesWhyUs.metricsTitle, metrics: structuredClone((row.metrics as ServicesWhyUsSettings['metrics'] | undefined) ?? defaultServicesWhyUs.metrics), title: row.title as string, cards: row.cards as ServicesWhyUsSettings['cards'], revision: Number(row.revision), updatedAt: row.updated_at as string }
}
