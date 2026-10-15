import type { CostsSettings } from '../../shared/types/costs'
export function serializeCosts(row: Record<string, unknown>): CostsSettings {
  return { fields: row.fields as CostsSettings['fields'], buttonLabel: row.button_label as string, revision: Number(row.revision), updatedAt: row.updated_at as string }
}
