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
  form: ContactFormSettings
  title: string
  hours: string
  requisitesTitle: string
  requisites: string
  mapSrc: string
  mapHref: string
  mapTitle: string
  socials: ContactSocial[]
}
export type ContactFormFieldId = 'name' | 'phone' | 'email' | 'subject' | 'message'
export interface ContactFormField { label: string; placeholder: string; required: boolean }
export interface ContactFormSettings {
  enabled: boolean
  title: string
  text: string
  phoneTitle: string
  phoneText: string
  phoneHref: string
  fields: Record<ContactFormFieldId, ContactFormField>
  topics: string[]
  consentText: string
  consentRequired: boolean
  buttonLabel: string
}
