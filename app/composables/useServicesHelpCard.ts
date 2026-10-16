import type { ServicesHelpCardSettings } from '#shared/types/services-help-card'
import { defaultServicesHelpCard } from '#shared/config/default-services-help-card'
export function useServicesHelpCard() {
  return useFetch<ServicesHelpCardSettings>('/api/services-help-card', { key: 'site-services-help-card', default: () => structuredClone(defaultServicesHelpCard) })
}
