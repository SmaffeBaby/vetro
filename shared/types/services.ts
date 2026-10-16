import type { SkillCard } from './skills'
export interface ServiceCard extends SkillCard {}
export interface ServicesSettings { title: string; text: string; cards: ServiceCard[]; revision: number; updatedAt: string | null; mediaCleanupPending?: boolean }
