import { z } from 'zod'
export const aboutLettersInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок блока').max(240),
  cards: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID письма'),
    organization: z.string().trim().min(1, 'Введите название организации').max(240),
    reference: z.string().trim().min(1, 'Введите название или номер письма').max(240),
    tag: z.string().trim().max(120),
    text: z.string().trim().min(1, 'Введите текст письма').max(6000),
    author: z.string().trim().min(1, 'Введите имя автора').max(240),
    position: z.string().trim().min(1, 'Введите должность автора').max(240)
  })).max(50, 'Максимум 50 писем').refine(cards => new Set(cards.map(card => card.id)).size === cards.length, 'ID писем должны быть уникальны'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
