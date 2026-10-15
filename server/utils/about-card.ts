import type { AboutCardSettings } from '../../shared/types/about-card'

export function serializeAboutCard(row: Record<string, unknown>): AboutCardSettings {
  return {
    leftItems: row.left_items as AboutCardSettings['leftItems'],
    centerText: row.center_text as string,
    rightItems: row.right_items as AboutCardSettings['rightItems'],
    revision: Number(row.revision),
    updatedAt: row.updated_at as string
  }
}
