import type { AboutCardSettings } from '#shared/types/about-card'
import { defaultAboutCard } from '#shared/config/default-about-card'

export function useAboutCard() {
  return useFetch<AboutCardSettings>('/api/about-card', { key: 'site-about-card', default: () => structuredClone(defaultAboutCard) })
}
