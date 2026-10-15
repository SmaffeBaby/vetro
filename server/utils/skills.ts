import type { SkillsSettings } from '../../shared/types/skills'
import { sortSkillCards } from '../../shared/utils/skills'

export function serializeSkills(row: Record<string, unknown>): SkillsSettings {
  return {
    cards: sortSkillCards(row.cards as SkillsSettings['cards']),
    revision: Number(row.revision),
    updatedAt: row.updated_at as string,
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0
  }
}
