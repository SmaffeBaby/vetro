import { z } from 'zod'
import type { CostField, CostSelection } from '../types/costs'
export const costsInputSchema = z.object({
  fields: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID списка'),
    label: z.string().trim().min(1, 'Введите название списка').max(120, 'Название: максимум 120 символов'),
    options: z.array(z.string().trim().min(1, 'Заполните или удалите пустой вариант').max(160, 'Вариант: максимум 160 символов'))
      .min(1, 'Добавьте хотя бы один вариант').max(50, 'Максимум 50 вариантов')
      .refine(items => new Set(items).size === items.length, 'Варианты списка не должны повторяться')
  })).min(1, 'Добавьте хотя бы один список').max(12, 'Максимум 12 списков')
    .refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID списков должны быть уникальными'),
  buttonLabel: z.string().trim().min(1, 'Введите текст кнопки').max(60, 'Кнопка: максимум 60 символов'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
export function selectedCostValues(fields: readonly CostField[], values: Record<string, string>): CostSelection[] | null {
  if (!fields.length || fields.some(field => !field.options.includes(values[field.id] || ''))) return null
  return fields.map(field => ({ id: field.id, label: field.label, value: values[field.id]! }))
}
