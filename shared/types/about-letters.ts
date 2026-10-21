export interface AboutLetter { id: string; organization: string; reference: string; tag: string; text: string; author: string; position: string }
export interface AboutLettersSettings { title: string; cards: AboutLetter[]; revision: number; updatedAt: string | null }
