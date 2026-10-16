import type { ServicePriceSettings } from '../../shared/types/services-prices'
export function serializeServicePrices(row: Record<string, unknown>): ServicePriceSettings {
  return { serviceId: row.service_id as string, title: row.title as string, description: row.description as string,
    buttonLabel: row.button_label as string, rows: row.rows as ServicePriceSettings['rows'], revision: Number(row.revision), updatedAt: row.updated_at as string }
}
