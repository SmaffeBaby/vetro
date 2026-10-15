import type { FooterSettings } from '../../shared/types/footer'
import { sortFooterColumns } from '../../shared/utils/footer'

export function serializeFooter(row: Record<string, unknown>): FooterSettings {
  return {
    logoSvg: row.logo_svg as string, logoPath: (row.logo_path as string | null) ?? null,
    logoFilename: (row.logo_filename as string) || 'logo.svg', text: row.text as string,
    columns: sortFooterColumns(row.columns as FooterSettings['columns']), buttonLabel: row.button_label as string,
    leftBottom: row.left_bottom as FooterSettings['leftBottom'], rightBottom: row.right_bottom as FooterSettings['rightBottom'],
    revision: Number(row.revision), updatedAt: row.updated_at as string,
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0
  }
}
