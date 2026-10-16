import { z } from 'zod'
export const serviceIdSchema = z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID услуги')
export const servicesDetailInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок').max(240, 'Заголовок: максимум 240 символов'),
  text: z.string().trim().min(1, 'Введите текст').max(4000, 'Текст: максимум 4000 символов'),
  buttonLabel: z.string().trim().min(1, 'Введите текст кнопки').max(80, 'Текст кнопки: максимум 80 символов'),
  svg: z.string().trim().max(200_000, 'SVG: максимум 200 КБ'),
  filename: z.string().trim().max(180).default('background.svg'),
  revision: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER - 1)
})
export function serviceDetailHref(id: string): string { return `/services/${encodeURIComponent(id)}` }
