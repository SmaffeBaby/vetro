import { z } from 'zod'
import { footerEntrySchema } from './footer'
import type { ContactItem } from '../types/contacts'
export const contactsInputSchema = z.object({
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
