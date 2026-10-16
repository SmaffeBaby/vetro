import { z } from 'zod'
export const serviceRequestInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок').max(240, 'Заголовок: максимум 240 символов'),
  description: z.string().trim().min(1, 'Введите описание').max(4000, 'Описание: максимум 4000 символов'),
  note: z.string().trim().max(2000, 'Пояснительный текст: максимум 2000 символов'),
  buttonLabel: z.string().trim().min(1, 'Введите текст кнопки').max(80, 'Текст кнопки: максимум 80 символов'),
  svg: z.string().trim().max(200_000, 'SVG: максимум 200 КБ'),
  filename: z.string().trim().max(180).default('logo.svg'),
  revision: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER - 1)
})
