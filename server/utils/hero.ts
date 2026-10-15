import type { HeroSettings } from '../../shared/types/hero'

export function serializeHero(row: Record<string, unknown>): HeroSettings {
  return {
    title: row.title as string,
    accentTitle: row.accent_title as string,
    text: row.text as string,
    regalia: row.regalia as string[],
    imagePath: (row.image_path as string | null) ?? null,
    imageFilename: (row.image_filename as string) || '',
    primaryButtonLabel: row.primary_button_label as string,
    secondaryButtonLabel: row.secondary_button_label as string,
    revision: Number(row.revision),
    updatedAt: row.updated_at as string,
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0
  }
}
