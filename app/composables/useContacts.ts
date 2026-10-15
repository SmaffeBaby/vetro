import type { ContactsSettings } from '#shared/types/contacts'
import { defaultContacts } from '#shared/config/default-contacts'
export function useContacts() {
  return useFetch<ContactsSettings>('/api/contacts', { key: 'site-contacts', default: () => structuredClone(defaultContacts) })
}
