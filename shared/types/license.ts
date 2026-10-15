export interface LicenseSettings {
  title: string
  buttonLabel: string
  imagePath: string | null
  imageFilename: string
  revision: number
  updatedAt: string | null
  mediaCleanupPending?: boolean
}
