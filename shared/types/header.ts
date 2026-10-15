export interface HeaderMenuItem {
  id: string
  label: string
  href: string
}

export interface HeaderSettings {
  logoSvg: string
  logoPath?: string | null
  logoFilename?: string
  mediaCleanupPending?: boolean
  menuItems: HeaderMenuItem[]
  buttonLabel: string
  revision: number
  updatedAt: string | null
}
