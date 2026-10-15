export interface AboutCardLeftItem {
  id: string
  title: string
  text: string
}

export interface AboutCardRightItem {
  id: string
  text: string
}

export interface AboutCardSettings {
  leftItems: AboutCardLeftItem[]
  centerText: string
  rightItems: AboutCardRightItem[]
  revision: number
  updatedAt: string | null
}
