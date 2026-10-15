export interface FooterEntry {
  id: string
  mode: 'text' | 'link' | 'code'
  text: string
  href: string
  code: string
  highlight: string
}
export interface FooterColumn {
  id: string
  title: string
  sortOrder: number
  items: FooterEntry[]
}
export interface FooterSettings {
  logoSvg: string
  logoPath?: string | null
  logoFilename: string
  text: string
  columns: FooterColumn[]
  buttonLabel: string
  leftBottom: FooterEntry[]
  rightBottom: FooterEntry[]
  revision: number
  updatedAt: string | null
  mediaCleanupPending?: boolean
}
export interface FooterCodeNode {
  tag?: string
  text?: string
  href?: string
  title?: string
  target?: '_blank' | '_self'
  children?: FooterCodeNode[]
}
