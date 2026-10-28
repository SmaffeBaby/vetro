import type { ServicesHelpCardSettings } from '#shared/types/services-help-card'
import { defaultServicesHelpCard } from '#shared/config/default-services-help-card'
export function useServicesHelpCard() {
  return useSiteQuery<ServicesHelpCardSettings>('/api/services-help-card', { default: () => structuredClone(defaultServicesHelpCard) })
}
