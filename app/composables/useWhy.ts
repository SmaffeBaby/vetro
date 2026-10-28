import type { WhySettings } from '#shared/types/why'
import { defaultWhy } from '#shared/config/default-why'
export function useWhy() {
  return useSiteQuery<WhySettings>('/api/why', { default: () => structuredClone(defaultWhy) })
}
