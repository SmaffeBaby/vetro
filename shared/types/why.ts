export interface WhyCard { id: string; sortOrder: number; svg: string; iconFilename: string; iconPath?: string | null; title: string; points: string[] }
export interface WhySettings { cards: WhyCard[]; revision: number; updatedAt: string | null; mediaCleanupPending?: boolean }
