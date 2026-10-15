import type { FaqSettings } from '../../shared/types/faq'
export function serializeFaq(row: Record<string, unknown>): FaqSettings {
  return { questions: row.questions as FaqSettings['questions'], benefits: row.benefits as FaqSettings['benefits'], revision: Number(row.revision), updatedAt: row.updated_at as string,
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0 }
}
