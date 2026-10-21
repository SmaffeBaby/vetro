import type { ContactsSettings } from '#shared/types/contacts'
import { defaultContacts } from '#shared/config/default-contacts'
export function useContactsPage() {
  return useFetch<ContactsSettings>('/api/contacts-page', { key: 'site-contacts-page', default: () => structuredClone(defaultContacts) })
}
