import { z } from 'zod'
import type { WhyCard } from '../types/why'
export const whyInputSchema = z.object({
  cards: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID карточки'),
    sortOrder: z.number().int().min(0).max(999999),
    svg: z.string().trim().max(200_000, 'SVG: максимум 200 КБ'),
    iconFilename: z.string().trim().max(180).default('logo.svg'),
    title: z.string().trim().min(1, 'Введите заголовок карточки').max(160),
    points: z.array(z.string().trim().min(1, 'Заполните текст пункта').max(2000)).max(12, 'Максимум 12 пунктов')
  })).max(12, 'Максимум 12 карточек').refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID карточек должны быть уникальными'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
}).refine(value => new TextEncoder().encode(JSON.stringify(value)).byteLength <= 1_500_000, 'Общий размер превышает 1,5 МБ. Уменьшите SVG.')
export function sortWhyCards(cards: WhyCard[]): WhyCard[] { return [...cards].sort((a, b) => a.sortOrder - b.sortOrder) }
