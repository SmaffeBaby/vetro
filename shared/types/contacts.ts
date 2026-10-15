import type { FooterEntry } from './footer'
export type ContactId = 'phone' | 'address' | 'email'
export interface ContactItem extends FooterEntry {
  id: ContactId
  title: string
  svg: string
  iconPath?: string | null
  iconFilename: string
}
export interface ContactsSettings {
  items: ContactItem[]
  revision: number
  updatedAt: string | null
  mediaCleanupPending?: boolean
}
