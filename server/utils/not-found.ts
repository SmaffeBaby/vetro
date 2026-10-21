import type { NotFoundSettings } from '../../shared/types/not-found'

export function serializeNotFound(row: Record<string, unknown>): NotFoundSettings {
  return { ...(row.content as Omit<NotFoundSettings, 'revision' | 'updatedAt'>), revision: Number(row.revision), updatedAt: row.updated_at as string }
}
