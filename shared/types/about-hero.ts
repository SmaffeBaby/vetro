export interface AboutHeroSettings {
  title: string
  breadcrumb: string
  subtitle: string
  text: string
  imageAlt: string
  imagePath: string | null
  imageFilename: string
  revision: number
  updatedAt: string | null
  mediaCleanupPending?: boolean
}
