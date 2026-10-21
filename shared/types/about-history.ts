export interface AboutHistoryItem { id: string; year: string; description: string }
export interface AboutHistorySettings { title: string; cards: AboutHistoryItem[]; revision: number; updatedAt: string | null }
