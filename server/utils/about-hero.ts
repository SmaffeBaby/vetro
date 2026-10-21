import type { AboutHeroSettings } from '../../shared/types/about-hero'

export function serializeAboutHero(row: Record<string, unknown>): AboutHeroSettings {
  return { ...(row.content as Pick<AboutHeroSettings, 'title' | 'breadcrumb' | 'subtitle' | 'text' | 'imageAlt'>),
    imagePath: row.image_path as string | null, imageFilename: row.image_filename as string,
    revision: Number(row.revision), updatedAt: row.updated_at as string,
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0 }
}
