import type { WhySettings } from '#shared/types/why'
import { defaultWhy } from '#shared/config/default-why'
export function useWhy() {
  return useFetch<WhySettings>('/api/why', { key: 'site-why', default: () => structuredClone(defaultWhy) })
}
