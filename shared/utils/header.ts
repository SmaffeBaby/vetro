import { z } from 'zod'

export function isSafeMenuHref(value: string): boolean {
  if (!value || /[\u0000-\u0020\\]/.test(value)) return false
  if (value.startsWith('/') && !value.startsWith('//')) return true
  if (/^#[\p{L}\p{N}_-]+$/u.test(value)) return true
  try {
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

export const headerInputSchema = z.object({
  logoSvg: z.string().trim().max(200_000, 'SVG должен быть меньше 200 КБ'),
  logoFilename: z.string().trim().max(180).optional(),
  menuItems: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID пункта'),
    label: z.string().trim().min(1, 'Введите название пункта').max(80, 'Максимум 80 символов'),
    href: z.string().trim().max(2048).refine(isSafeMenuHref, 'Используйте путь /page, #anchor, https://, mailto: или tel:')
  })).max(12, 'Максимум 12 пунктов меню').refine(
    items => new Set(items.map(item => item.id)).size === items.length,
    'ID пунктов меню должны быть уникальными'
  ),
  buttonLabel: z.string().trim().min(1, 'Введите название кнопки').max(60, 'Максимум 60 символов'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
