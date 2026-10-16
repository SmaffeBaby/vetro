export interface ServicePriceRow { id: string; name: string; price: string }
export interface ServicePriceSettings {
  serviceId: string
  title: string
  description: string
  buttonLabel: string
  rows: ServicePriceRow[]
  revision: number
  updatedAt: string | null
}
