import type { ServiceIncludedSettings } from '../../shared/types/services-included'

export function serializeServicesIncluded(row: Record<string, unknown>): ServiceIncludedSettings {
  return { serviceId: row.service_id as string, title: row.title as string, text: row.text as string,
    buttonLabel: row.button_label as string, items: row.items as ServiceIncludedSettings['items'],
    revision: Number(row.revision), updatedAt: row.updated_at as string }
}
