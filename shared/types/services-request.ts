export interface ServiceRequestSettings {
  serviceId: string
  title: string
  description: string
  note: string
  buttonLabel: string
  svg: string
  imagePath: string | null
  filename: string
  revision: number
  updatedAt: string | null
  mediaCleanupPending?: boolean
}
