import {z} from 'zod'
import {objectIdSchema} from './objects'
export const otherObjectsInputSchema=z.object({
 title:z.string().trim().min(1,'Введите заголовок').max(240),
 buttonLabel:z.string().trim().min(1,'Введите текст кнопки').max(80),
 objectIds:z.array(objectIdSchema).max(100,'Максимум 100 объектов').refine(a=>new Set(a).size===a.length,'Объекты не должны повторяться'),
 revision:z.number().int().positive().max(Number.MAX_SAFE_INTEGER-1)
})
