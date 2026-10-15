export interface SkillCard {
  id: string
  svg: string
  iconPath?: string | null
  iconFilename?: string
  sortOrder: number
  title: string
  text: string
}

export interface SkillsSettings {
  cards: SkillCard[]
  revision: number
  updatedAt: string | null
  mediaCleanupPending?: boolean
}
