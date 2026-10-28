import type { HeroSettings } from '#shared/types/hero'
import { defaultHero } from '#shared/config/default-hero'

export function useHero() {
  return useSiteQuery<HeroSettings>('/api/hero', { default: () => structuredClone(defaultHero) })
}
