import { z } from 'zod'
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID элемента')
export const faqInputSchema = z.object({
  questions: z.array(z.object({ id,
    question: z.string().trim().min(1, 'Введите вопрос').max(300, 'Вопрос: максимум 300 символов'),
    answer: z.string().trim().min(1, 'Введите ответ').max(5000, 'Ответ: максимум 5000 символов')
  })).max(30, 'Максимум 30 вопросов').refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID вопросов должны быть уникальными'),
  benefits: z.array(z.object({ id,
    svg: z.string().trim().max(200_000, 'SVG: максимум 200 КБ'),
    iconFilename: z.string().trim().max(180).default('logo.svg'),
    title: z.string().trim().min(1, 'Введите заголовок преимущества').max(160, 'Заголовок: максимум 160 символов'),
    text: z.string().trim().min(1, 'Введите текст преимущества').max(2000, 'Текст: максимум 2000 символов')
  })).max(12, 'Максимум 12 преимуществ').refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID преимуществ должны быть уникальными'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
}).refine(value => new TextEncoder().encode(JSON.stringify(value)).byteLength <= 1_500_000, 'Общий размер FAQ превышает 1,5 МБ. Уменьшите SVG.')
