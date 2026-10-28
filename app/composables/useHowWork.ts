import type { HowWorkSettings } from '#shared/types/how-work'
import { defaultHowWork } from '#shared/config/default-how-work'
export function useHowWork() {
  return useSiteQuery<HowWorkSettings>('/api/how-work', { default: () => structuredClone(defaultHowWork) })
}
