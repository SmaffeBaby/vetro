import type { ServicesTeamSettings } from '../../shared/types/services-team'
import { sortTeamCards } from '../../shared/utils/services-team'
export function serializeServicesTeam(row: Record<string, unknown>): ServicesTeamSettings {
 return { title: row.title as string, description: row.description as string, cards: sortTeamCards(row.cards as ServicesTeamSettings['cards']), revision: Number(row.revision), updatedAt: row.updated_at as string, mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0 }
}
