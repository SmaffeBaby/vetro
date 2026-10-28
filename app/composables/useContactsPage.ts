import type { ContactsSettings } from '#shared/types/contacts'
import { defaultContacts } from '#shared/config/default-contacts'
export function useContactsPage() {
  return useSiteQuery<ContactsSettings>('/api/contacts-page', { default: () => structuredClone(defaultContacts) })
}
