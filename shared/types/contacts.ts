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
  page: ContactsPageSettings
  revision: number
  updatedAt: string | null
  mediaCleanupPending?: boolean
}
export interface ContactSocial {
  id: 'telegram' | 'whatsapp'
  title: string
  href: string
  svg: string
  iconFilename: string
  iconPath?: string | null
}
export interface ContactsPageSettings {
  title: string
  hours: string
  requisitesTitle: string
  requisites: string
  mapSrc: string
  mapHref: string
  mapTitle: string
  socials: ContactSocial[]
}
