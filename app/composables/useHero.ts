import type { HeroSettings } from '#shared/types/hero'
import { defaultHero } from '#shared/config/default-hero'

export function useHero() {
  return useFetch<HeroSettings>('/api/hero', { key: 'site-hero', default: () => structuredClone(defaultHero) })
}
