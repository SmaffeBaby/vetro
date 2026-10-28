import type { LicenseSettings } from '#shared/types/license'
import { defaultLicense } from '#shared/config/default-license'
export function useLicense() {
  return useSiteQuery<LicenseSettings>('/api/license', { default: () => structuredClone(defaultLicense) })
}
