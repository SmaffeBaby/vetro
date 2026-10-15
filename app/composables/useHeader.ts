import type { HeaderSettings } from '#shared/types/header'
import { defaultHeader } from '#shared/config/default-header'

export function useHeader() {
  return useFetch<HeaderSettings>('/api/header', { key: 'site-header', default: () => defaultHeader })
}

export function useHeaderLogo(svg: () => string) {
  return computed(() => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg())}`)
}
