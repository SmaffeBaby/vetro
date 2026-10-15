export interface HeroSettings {
  title: string
  accentTitle: string
  text: string
  regalia: string[]
  imagePath: string | null
  imageFilename: string
  primaryButtonLabel: string
  secondaryButtonLabel: string
  revision: number
  updatedAt: string | null
  mediaCleanupPending?: boolean
}
