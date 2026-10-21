import { z } from 'zod'
import { footerEntrySchema } from './footer'
import type { ContactItem } from '../types/contacts'
function yandexUrl(value: string, widget = false) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'yandex.ru' && !url.port && !url.username && !url.password && (widget ? url.pathname === '/map-widget/v1/' : url.pathname.startsWith('/maps/'))
  } catch { return false }
}
export const contactsPageInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок страницы').max(240),
  hours: z.string().trim().max(1000),
  requisitesTitle: z.string().trim().min(1, 'Введите заголовок реквизитов').max(240),
  requisites: z.string().trim().max(12000),
  mapSrc: z.string().trim().max(2048).refine(value => yandexUrl(value, true), 'Укажите src виджета https://yandex.ru/map-widget/v1/'),
  mapHref: z.string().trim().max(2048).refine(value => yandexUrl(value), 'Укажите ссылку на https://yandex.ru/maps/'),
  mapTitle: z.string().trim().min(1, 'Введите описание карты').max(500),
  socials: z.array(z.object({
    id: z.enum(['telegram', 'whatsapp']), title: z.string().trim().min(1).max(80),
    href: z.string().trim().max(2048).refine(value => {
      if (!value) return true
      try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password } catch { return false }
    }, 'Укажите ссылку https:// или оставьте поле пустым'),
    svg: z.string().trim().max(200000, 'SVG: максимум 200 КБ'),
    iconFilename: z.string().trim().max(180)
  })).length(2).refine(items => new Set(items.map(item => item.id)).size === 2, 'Мессенджеры должны быть уникальны')
})
export const contactsInputSchema = z.object({
  page: contactsPageInputSchema,
  items: z.array(footerEntrySchema.and(z.object({
    id: z.enum(['phone', 'address', 'email']),
    title: z.string().trim().min(1, 'Введите название контакта').max(120, 'Название: максимум 120 символов'),
    svg: z.string().trim().max(200_000, 'SVG: максимум 200 КБ'),
    iconFilename: z.string().trim().max(180).default('logo.svg')
  }))).length(3, 'Нужны телефон, адрес и email').refine(items => new Set(items.map(item => item.id)).size === 3, 'Телефон, адрес и email должны быть уникальными'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
}).refine(value => new TextEncoder().encode(JSON.stringify(value)).byteLength <= 1_500_000, 'Общий размер контактов превышает 1,5 МБ. Уменьшите SVG.')
const order = { phone: 0, address: 1, email: 2 }
export function sortContacts(items: readonly ContactItem[]): ContactItem[] {
  return [...items].sort((a, b) => order[a.id] - order[b.id])
}
