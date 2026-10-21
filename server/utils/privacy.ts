import type { PrivacySettings } from '../../shared/types/privacy'
export function serializePrivacy(row: Record<string, unknown>): PrivacySettings {
  return { ...(row.content as Omit<PrivacySettings, 'revision' | 'updatedAt'>), revision: Number(row.revision), updatedAt: row.updated_at as string }
}
