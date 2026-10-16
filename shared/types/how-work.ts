export interface WorkCard { id: string; sortOrder: number; title: string; text: string }
export interface HowWorkSettings { cards: WorkCard[]; revision: number; updatedAt: string | null }
