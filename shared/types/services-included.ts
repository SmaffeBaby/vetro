export interface ServiceIncludedItem {
  id: string
  title: string
  text: string
  detailTitle: string
  detailText: string
  body: string
  buttonLabel: string
}

export interface ServiceIncludedSettings {
  serviceId: string
  title: string
  text: string
  buttonLabel: string
  items: ServiceIncludedItem[]
  revision: number
  updatedAt: string | null
}
