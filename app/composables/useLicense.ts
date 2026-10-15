import type { LicenseSettings } from '#shared/types/license'
import { defaultLicense } from '#shared/config/default-license'
export function useLicense() {
  return useFetch<LicenseSettings>('/api/license', { key: 'site-license', default: () => structuredClone(defaultLicense) })
}
