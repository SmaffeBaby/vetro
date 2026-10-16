import { z } from 'zod'
import { skillsInputSchema } from './skills'
export { sortSkillCards as sortServiceCards } from './skills'
export const servicesInputSchema = z.object({
  ...skillsInputSchema.shape,
  title: z.string().trim().min(1, 'Введите заголовок страницы').max(160),
  text: z.string().trim().min(1, 'Введите текст страницы').max(3000)
}).refine(value => new TextEncoder().encode(JSON.stringify(value)).byteLength <= 1_500_000, 'Общий размер превышает 1,5 МБ. Уменьшите SVG.')
