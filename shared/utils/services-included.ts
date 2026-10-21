import { z } from 'zod'
import { serviceIdSchema } from './services-detail'

export const serviceIncludedInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок блока').max(240),
  text: z.string().trim().max(4000),
  buttonLabel: z.string().trim().min(1, 'Введите подпись кнопки карточки').max(80),
  items: z.array(z.object({
    id: serviceIdSchema,
    title: z.string().trim().min(1, 'Введите название пункта').max(240),
    text: z.string().trim().min(1, 'Введите описание карточки').max(4000),
    detailTitle: z.string().trim().min(1, 'Введите заголовок страницы').max(240),
    detailText: z.string().trim().min(1, 'Введите текст первого экрана').max(4000),
    body: z.string().trim().max(20000),
    buttonLabel: z.string().trim().min(1, 'Введите подпись кнопки заявки').max(80)
  })).max(100).refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID пунктов должны быть уникальны'),
  revision: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER - 1)
})

export function serviceIncludedHref(serviceId: string, itemId: string) {
  return `/services/${encodeURIComponent(serviceId)}/${encodeURIComponent(itemId)}`
}
