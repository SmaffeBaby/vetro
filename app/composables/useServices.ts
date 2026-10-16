import type { ServicesSettings } from '#shared/types/services'
import { defaultServices } from '#shared/config/default-services'
export function useServices() {
  return useFetch<ServicesSettings>('/api/services', { key: 'site-services', default: () => structuredClone(defaultServices) })
}
