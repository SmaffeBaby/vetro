import type { HeaderSettings } from '../../shared/types/header'

export function serializeHeader(row: Record<string, unknown>): HeaderSettings {
  return {
    logoSvg: row.logo_svg as string,
    logoPath: (row.logo_path as string | null) ?? null,
    logoFilename: (row.logo_filename as string) || 'logo.svg',
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0,
    menuItems: row.menu_items as HeaderSettings['menuItems'],
    buttonLabel: row.button_label as string,
    revision: Number(row.revision),
    updatedAt: row.updated_at as string
  }
}
