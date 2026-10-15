import { z } from 'zod'

const itemId = z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID элемента')
const text = z.string().trim().min(1, 'Введите текст элемента').max(2000, 'Текст: максимум 2000 символов')

export const aboutCardInputSchema = z.object({
  leftItems: z.array(z.object({
    id: itemId,
    title: z.string().trim().min(1, 'Введите заголовок показателя').max(120, 'Заголовок: максимум 120 символов'),
    text: z.string().trim().min(1, 'Введите текст показателя').max(500, 'Текст показателя: максимум 500 символов')
  })).max(12, 'Максимум 12 показателей').refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID показателей должны быть уникальными'),
  centerText: z.string().trim().min(1, 'Введите центральный текст').max(2000, 'Центральный текст: максимум 2000 символов'),
  rightItems: z.array(z.object({ id: itemId, text })).max(12, 'Максимум 12 пунктов справа')
    .refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID пунктов должны быть уникальными'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
