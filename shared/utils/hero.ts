import { z } from 'zod'

export const heroInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок').max(240, 'Заголовок: максимум 240 символов'),
  accentTitle: z.string().trim().max(120, 'Акцент: максимум 120 символов'),
  text: z.string().trim().max(1000, 'Текст: максимум 1000 символов'),
  regalia: z.array(z.string().trim().min(1, 'Заполните или удалите пустую регалию').max(120, 'Регалия: максимум 120 символов')).max(12, 'Максимум 12 регалий'),
  primaryButtonLabel: z.string().trim().min(1, 'Введите название первой кнопки').max(60, 'Название кнопки: максимум 60 символов'),
  secondaryButtonLabel: z.string().trim().min(1, 'Введите название второй кнопки').max(60, 'Название кнопки: максимум 60 символов'),
  removeImage: z.boolean().default(false),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
