import { z } from 'zod'
import { mediaUrl } from './media'

export const aboutHeroInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок страницы').max(240),
  breadcrumb: z.string().trim().min(1, 'Введите название в хлебных крошках').max(120),
  subtitle: z.string().trim().min(1, 'Введите подзаголовок').max(500),
  text: z.string().trim().min(1, 'Введите текст о компании').max(12000),
  imageAlt: z.string().trim().min(1, 'Введите описание фото').max(500),
  removeImage: z.boolean().default(false),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
export function aboutHeroImageUrl(path: string) {
  return path === '/images/about/hero.png' ? path : mediaUrl(path)
}
