import { z } from 'zod'

const internalHref = z.string().trim().max(2048).refine(value => {
  if (!value.startsWith('/') || value.startsWith('//') || /[\u0000-\u0020\\]/.test(value)) return false
  try {
    const decoded = decodeURIComponent(value)
    return !decoded.startsWith('//') && !/[\u0000-\u0020\\]/.test(decoded)
  } catch { return false }
}, 'Укажите внутренний адрес сайта, например / или /services')

export const notFoundInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок').max(240),
  text: z.string().trim().min(1, 'Введите поясняющий текст').max(4000),
  primaryLabel: z.string().trim().min(1, 'Введите название основной кнопки').max(80),
  primaryHref: internalHref,
  secondaryLabel: z.string().trim().min(1, 'Введите название второй кнопки').max(80),
  secondaryHref: internalHref,
  showLogo: z.boolean(),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
