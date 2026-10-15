import type { LicenseSettings } from '../../shared/types/license'
export function serializeLicense(row: Record<string, unknown>): LicenseSettings {
  return { title: row.title as string, buttonLabel: row.button_label as string,
    imagePath: (row.image_path as string | null) ?? null, imageFilename: (row.image_filename as string) || '',
    revision: Number(row.revision), updatedAt: row.updated_at as string,
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0 }
}
