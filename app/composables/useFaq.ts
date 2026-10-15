import type { FaqSettings } from '#shared/types/faq'
import { defaultFaq } from '#shared/config/default-faq'
export function useFaq() {
  return useFetch<FaqSettings>('/api/faq', { key: 'site-faq', default: () => structuredClone(defaultFaq) })
}
