import { z } from 'zod'
export const privacyInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок страницы').max(240),
  breadcrumb: z.string().trim().min(1, 'Введите название в хлебных крошках').max(240),
  intro: z.string().trim().max(4000),
  navigationLabel: z.string().trim().min(1, 'Введите название оглавления').max(120),
  sections: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,79}$/, 'ID раздела: латинские буквы, цифры, дефис и подчёркивание; первый символ — буква'),
    title: z.string().trim().min(1, 'Введите заголовок раздела').max(240),
    text: z.string().trim().min(1, 'Введите текст раздела').max(20000)
  })).min(1, 'Добавьте хотя бы один раздел').max(50).refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID разделов должны быть уникальными'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
export function privacySectionId(id: string) { return `privacy-${id}` }
