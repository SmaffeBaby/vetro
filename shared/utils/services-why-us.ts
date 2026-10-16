import { z } from 'zod'
export const servicesWhyUsInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заглавный заголовок').max(240, 'Заглавный заголовок: максимум 240 символов'),
  cards: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID карточки'),
    title: z.string().trim().min(1, 'Введите заголовок карточки').max(160, 'Заголовок: максимум 160 символов'),
    caption: z.string().trim().min(1, 'Введите пояснение карточки').max(240, 'Пояснение: максимум 240 символов'),
    description: z.string().trim().min(1, 'Введите описание карточки').max(3000, 'Описание: максимум 3000 символов')
  })).max(12, 'Максимум 12 карточек').refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID карточек должны быть уникальными'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
