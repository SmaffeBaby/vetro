import type { ServicesHelpCardSettings } from '../../shared/types/services-help-card'
export function serializeServicesHelpCard(row: Record<string, unknown>): ServicesHelpCardSettings {
  return { title: row.title as string, text: row.text as string, buttonLabel: row.button_label as string,
    svg: row.svg as string, imagePath: (row.image_path as string | null) ?? null, filename: row.filename as string,
    revision: Number(row.revision), updatedAt: row.updated_at as string,
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0 }
}
