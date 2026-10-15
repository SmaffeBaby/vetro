import type { FooterSettings } from '#shared/types/footer'
import { defaultFooter } from '#shared/config/default-footer'

export function useFooter() {
  return useFetch<FooterSettings>('/api/footer', { key: 'site-footer', default: () => structuredClone(defaultFooter) })
}

export function useFooterYear() {
  const currentYear = () => Number(new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Europe/Moscow' }).format(new Date()))
  const year = useState('footer-current-year', currentYear)
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => { year.value = currentYear(); timer = setInterval(() => { year.value = currentYear() }, 60_000) })
  onBeforeUnmount(() => { if (timer) clearInterval(timer) })
  return year
}
