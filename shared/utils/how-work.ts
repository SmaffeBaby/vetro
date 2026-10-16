import { z } from 'zod'
import type { WorkCard } from '../types/how-work'
export const howWorkInputSchema = z.object({
  cards: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID карточки'),
    sortOrder: z.number().int('Сортировка должна быть целым числом').min(0, 'Сортировка не может быть отрицательной').max(999999, 'Сортировка: максимум 999999'),
    title: z.string().trim().min(1, 'Введите заголовок карточки').max(160, 'Заголовок: максимум 160 символов'),
    text: z.string().trim().min(1, 'Введите текст карточки').max(3000, 'Текст: максимум 3000 символов')
  })).max(12, 'Максимум 12 карточек').refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID карточек должны быть уникальными'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
export function sortWorkCards(cards: readonly WorkCard[]): WorkCard[] {
  return [...cards].sort((a, b) => a.sortOrder - b.sortOrder)
}
