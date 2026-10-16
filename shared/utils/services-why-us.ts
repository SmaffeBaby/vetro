import { z } from 'zod'
export const servicesWhyUsInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заглавный заголовок').max(240, 'Заглавный заголовок: максимум 240 символов'),
  cards: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID карточки'),
    description: z.string().trim().min(1, 'Введите текст карточки').max(4000, 'Текст: максимум 4000 символов')
  })).max(12, 'Максимум 12 карточек').refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID карточек должны быть уникальными'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
