import { z } from 'zod'
export const objectIdSchema = z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Используйте латинские буквы, цифры, дефис и подчёркивание в ID')
export const objectsSettingsInputSchema = z.object({
 title:z.string().trim().min(1,'Введите заголовок').max(240),buttonLabel:z.string().trim().min(1,'Введите название кнопки').max(80),
 categories:z.array(z.object({id:objectIdSchema.refine(id=>id!=='all','ID all зарезервирован для фильтра «Все»'),label:z.string().trim().min(1,'Введите название категории').max(100)})).min(1).max(20).refine(a=>new Set(a.map(c=>c.id)).size===a.length,'ID категорий должны быть уникальны'),
 revision:z.number().int().positive().max(Number.MAX_SAFE_INTEGER-1)
})
export const objectInputSchema = z.object({
 id:objectIdSchema.refine(id=>id!=='settings','Этот ID зарезервирован'),title:z.string().trim().min(1,'Введите название объекта').max(240),address:z.string().trim().min(1,'Введите адрес').max(500),
 categoryId:objectIdSchema,sortOrder:z.number().int().min(0).max(999999),published:z.boolean(),
 subtitle:z.string().trim().max(1000),description:z.string().trim().max(12000),area:z.string().trim().max(100),
 sinceYear:z.number().int().min(1900).max(2100).nullable(),
 serviceIds:z.array(objectIdSchema).max(100).refine(a=>new Set(a).size===a.length,'Услуги не должны повторяться'),
 removeImage:z.boolean().default(false),revision:z.number().int().min(0).max(Number.MAX_SAFE_INTEGER-1)
})
export function objectHref(id:string) { return `/objects/${encodeURIComponent(id)}` }
