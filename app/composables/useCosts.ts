import type { CostsSettings } from '#shared/types/costs'
import { defaultCosts } from '#shared/config/default-costs'
export function useCosts() {
  return useSiteQuery<CostsSettings>('/api/costs', { default: () => structuredClone(defaultCosts) })
}
