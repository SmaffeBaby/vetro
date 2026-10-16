import { z } from 'zod'
export const servicesHelpCardInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок').max(240, 'Заголовок: максимум 240 символов'),
  text: z.string().trim().min(1, 'Введите текст').max(3000, 'Текст: максимум 3000 символов'),
  buttonLabel: z.string().trim().min(1, 'Введите текст кнопки').max(80, 'Текст кнопки: максимум 80 символов'),
  svg: z.string().trim().max(200_000, 'SVG: максимум 200 КБ'),
  filename: z.string().trim().max(180).default('logo.svg'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
