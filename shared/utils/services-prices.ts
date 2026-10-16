import { z } from 'zod'
export const servicePricesInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок').max(240),
  description: z.string().trim().min(1, 'Введите описание').max(4000),
  buttonLabel: z.string().trim().min(1, 'Введите название кнопки').max(80),
  rows: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID строки'),
    name: z.string().trim().min(1, 'Введите название работы').max(300),
    price: z.string().trim().min(1, 'Введите текст с ценой').max(160)
  })).max(50, 'Максимум 50 строк прайс-листа').refine(rows => new Set(rows.map(row => row.id)).size === rows.length, 'ID строк должны быть уникальными'),
  revision: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER - 1)
})
