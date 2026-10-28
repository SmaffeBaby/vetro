import type { FaqSettings } from '#shared/types/faq'
import { defaultFaq } from '#shared/config/default-faq'
export function useFaq() {
  return useSiteQuery<FaqSettings>('/api/faq', { default: () => structuredClone(defaultFaq) })
}
