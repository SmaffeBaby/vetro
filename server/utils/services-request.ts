import type { ServiceRequestSettings } from '../../shared/types/services-request'
export function serializeServiceRequest(row: Record<string, unknown>): ServiceRequestSettings {
  return { serviceId: row.service_id as string, title: row.title as string, description: row.description as string, note: row.note as string, buttonLabel: row.button_label as string,
    svg: row.svg as string, imagePath: (row.image_path as string | null) ?? null, filename: row.filename as string,
    revision: Number(row.revision), updatedAt: row.updated_at as string,
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0 }
}
