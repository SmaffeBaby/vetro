import { z } from 'zod'
export const licenseImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif']
export const licenseInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите название лицензии').max(240, 'Название: максимум 240 символов'),
  buttonLabel: z.string().trim().min(1, 'Введите текст кнопки').max(60, 'Кнопка: максимум 60 символов'),
  removeImage: z.boolean().default(false),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
