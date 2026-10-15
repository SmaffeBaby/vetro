import { z } from 'zod'
import type { SkillCard } from '../types/skills'

export const skillsInputSchema = z.object({
  cards: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID карточки'),
    iconFilename: z.string().trim().max(240).default('icon.svg'),
    svg: z.string().trim().min(1, 'Добавьте SVG карточки').max(200_000, 'SVG: максимум 200 КБ'),
    sortOrder: z.number().int('Сортировка должна быть целым числом').min(0, 'Сортировка не может быть отрицательной').max(999_999, 'Сортировка: максимум 999999'),
    title: z.string().trim().min(1, 'Введите заголовок карточки').max(160, 'Заголовок: максимум 160 символов'),
    text: z.string().trim().min(1, 'Введите текст карточки').max(1000, 'Текст: максимум 1000 символов')
  })).max(12, 'Максимум 12 карточек').refine(cards => new Set(cards.map(card => card.id)).size === cards.length, 'ID карточек должны быть уникальными'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
}).refine(value => new TextEncoder().encode(JSON.stringify(value)).byteLength <= 1_500_000, 'Общий размер карточек превышает 1,5 МБ. Уменьшите размер SVG.')

// Stable sort preserves the editorial order when two sort values are equal.
export function sortSkillCards(cards: readonly SkillCard[]): SkillCard[] {
  return [...cards].sort((a, b) => a.sortOrder - b.sortOrder)
}
