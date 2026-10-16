import { z } from 'zod'
import type { TeamCard } from '../types/services-team'
export const servicesTeamInputSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок').max(240),
  description: z.string().trim().min(1, 'Введите описание команды').max(4000),
  cards: z.array(z.object({
    id: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/),
    sortOrder: z.number().int().min(0).max(999999),
    name: z.string().trim().min(1, 'Введите имя и фамилию').max(160),
    position: z.string().trim().min(1, 'Введите должность').max(240),
    description: z.string().trim().min(1, 'Введите описание сотрудника').max(3000),
    removeImage: z.boolean().default(false)
  })).max(24, 'Максимум 24 карточки').refine(cards => new Set(cards.map(c => c.id)).size === cards.length, 'ID карточек должны быть уникальными'),
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
export function sortTeamCards<T extends Pick<TeamCard, 'sortOrder'>>(cards: readonly T[]): T[] { return [...cards].sort((a,b) => a.sortOrder - b.sortOrder) }
