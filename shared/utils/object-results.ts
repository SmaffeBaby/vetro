import {z} from 'zod'
import {objectIdSchema} from './objects'
export const objectResultsInputSchema=z.object({
 title:z.string().trim().min(1,'Введите заголовок').max(240),
 cards:z.array(z.object({id:objectIdSchema,value:z.string().trim().min(1,'Введите значение показателя').max(100),text:z.string().trim().min(1,'Введите пояснение').max(1000)})).max(16,'Максимум 16 показателей').refine(a=>new Set(a.map(c=>c.id)).size===a.length,'ID показателей должны быть уникальны'),
 revision:z.number().int().min(0).max(Number.MAX_SAFE_INTEGER-1)
})
