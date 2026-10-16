export interface ServiceDetailSettings {
  serviceId: string
  title: string
  text: string
  buttonLabel: string
  svg: string
  imagePath: string | null
  filename: string
  revision: number
  updatedAt: string | null
  mediaCleanupPending?: boolean
}
export interface ServiceDetailPage extends ServiceDetailSettings { breadcrumb: string }
