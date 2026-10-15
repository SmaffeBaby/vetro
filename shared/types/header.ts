export interface HeaderMenuItem {
  id: string
  label: string
  href: string
}

export interface HeaderSettings {
  logoSvg: string
  menuItems: HeaderMenuItem[]
  buttonLabel: string
  revision: number
  updatedAt: string | null
}
