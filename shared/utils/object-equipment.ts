import {z} from 'zod'
import {objectIdSchema} from './objects'
export const objectEquipmentInputSchema=z.object({
 enabled:z.boolean(),
 title:z.string().trim().min(1,'Введите заголовок').max(400),
 columns:z.array(z.object({id:objectIdSchema,title:z.string().trim().min(1,'Введите название столбца').max(120)})).min(1).max(8,'Максимум 8 столбцов').refine(a=>new Set(a.map(c=>c.id)).size===a.length,'ID столбцов должны быть уникальны'),
 rows:z.array(z.object({id:objectIdSchema,cells:z.array(z.string().trim().max(1000,'Текст ячейки: максимум 1000 символов')).min(1).max(8)})).max(100,'Максимум 100 строк').refine(a=>new Set(a.map(r=>r.id)).size===a.length,'ID строк должны быть уникальны'),
 description:z.string().trim().max(10000,'Описание: максимум 10 000 символов'),
 revision:z.number().int().min(0).max(Number.MAX_SAFE_INTEGER-1)
}).refine(value=>value.rows.every(row=>row.cells.length===value.columns.length),'Количество ячеек должно соответствовать столбцам').refine(value=>new TextEncoder().encode(JSON.stringify(value)).byteLength<=150000,'Таблица слишком большая. Сократите текст.')
