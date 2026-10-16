import type { HowWorkSettings } from '#shared/types/how-work'
import { defaultHowWork } from '#shared/config/default-how-work'
export function useHowWork() {
  return useFetch<HowWorkSettings>('/api/how-work', { key: 'site-how-work', default: () => structuredClone(defaultHowWork) })
}
