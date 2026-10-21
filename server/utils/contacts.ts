import type { ContactsSettings } from '../../shared/types/contacts'
import { sortContacts } from '../../shared/utils/contacts'
import { defaultContactsPage } from '../../shared/config/default-contacts'
export function serializeContacts(row: Record<string, unknown>): ContactsSettings {
  return { items: sortContacts(row.items as ContactsSettings['items']), page: (row.page as ContactsSettings['page']) || structuredClone(defaultContactsPage), revision: Number(row.revision), updatedAt: row.updated_at as string,
    mediaCleanupPending: Array.isArray(row.media_cleanup_paths) && row.media_cleanup_paths.length > 0 }
}
