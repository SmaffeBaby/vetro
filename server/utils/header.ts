import type { HeaderSettings } from '../../shared/types/header'

export function serializeHeader(row: Record<string, unknown>): HeaderSettings {
  return {
    logoSvg: row.logo_svg as string,
    menuItems: row.menu_items as HeaderSettings['menuItems'],
    buttonLabel: row.button_label as string,
    revision: Number(row.revision),
    updatedAt: row.updated_at as string
  }
}
