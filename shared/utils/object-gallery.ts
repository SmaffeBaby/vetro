import {z} from 'zod'
import {objectIdSchema} from './objects'
export const GALLERY_UPLOAD_MAX_BYTES=25_000_000
export const GALLERY_IMAGE_TYPES=['image/png','image/jpeg','image/webp']
export const objectGalleryInputSchema=z.object({
 title:z.string().trim().min(1,'Введите заголовок').max(240),
 photos:z.array(z.object({id:objectIdSchema,caption:z.string().trim().max(500,'Подпись: максимум 500 символов')})).max(30,'Максимум 30 фотографий').refine(a=>new Set(a.map(p=>p.id)).size===a.length,'ID фотографий должны быть уникальны'),
 revision:z.number().int().min(0).max(Number.MAX_SAFE_INTEGER-1)
})
