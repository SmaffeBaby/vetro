import type { CostsSettings } from '#shared/types/costs'
import { defaultCosts } from '#shared/config/default-costs'
export function useCosts() {
  return useFetch<CostsSettings>('/api/costs', { key: 'site-costs', default: () => structuredClone(defaultCosts) })
}
