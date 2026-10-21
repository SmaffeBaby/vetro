import { z } from 'zod'
export const aboutHistoryInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок блока').max(240),
  cards: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID события'),
    year: z.string().trim().regex(/^\d{4}$/, 'Укажите год из четырёх цифр'),
    description: z.string().trim().min(1, 'Введите описание события').max(4000)
  })).max(50, 'Максимум 50 событий').refine(cards => new Set(cards.map(card => card.id)).size === cards.length, 'ID событий должны быть уникальны'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
