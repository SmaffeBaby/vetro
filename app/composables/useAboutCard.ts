import type { AboutCardSettings } from '#shared/types/about-card'
import { defaultAboutCard } from '#shared/config/default-about-card'

export function useAboutCard() {
  return useSiteQuery<AboutCardSettings>('/api/about-card', { default: () => structuredClone(defaultAboutCard) })
}
