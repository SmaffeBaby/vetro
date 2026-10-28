import type { ContactsSettings } from '#shared/types/contacts'
import { defaultContacts } from '#shared/config/default-contacts'
export function useContacts() {
  return useSiteQuery<ContactsSettings>('/api/contacts', { default: () => structuredClone(defaultContacts) })
}
