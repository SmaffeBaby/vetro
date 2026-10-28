import type { ServicesSettings } from '#shared/types/services'
import { defaultServices } from '#shared/config/default-services'
export function useServices() {
  return useSiteQuery<ServicesSettings>('/api/services', { default: () => structuredClone(defaultServices) })
}
