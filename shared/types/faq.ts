export interface FaqQuestion { id: string; question: string; answer: string }
export interface FaqBenefit { id: string; svg: string; iconFilename: string; iconPath?: string | null; title: string; text: string }
export interface FaqSettings { questions: FaqQuestion[]; benefits: FaqBenefit[]; revision: number; updatedAt: string | null; mediaCleanupPending?: boolean }
