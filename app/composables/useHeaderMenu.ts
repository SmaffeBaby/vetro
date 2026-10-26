import { breakpoints } from '#shared/config/breakpoints'

export function useHeaderMenu() {
  const isOpen = ref(false)
  const rootRef = useTemplateRef<HTMLElement>('menuRoot')
  const toggleRef = useTemplateRef<HTMLButtonElement>('menuToggle')
  const route = useRoute()
  const close = () => { isOpen.value = false }
  const closeAndFocus = () => { close(); toggleRef.value?.focus() }
  const toggle = () => { isOpen.value = !isOpen.value }
  let previousOverflow: string | undefined
  const unlockScroll = () => {
    if (previousOverflow !== undefined) {
      document.body.style.overflow = previousOverflow
      previousOverflow = undefined
    }
  }
  watch(isOpen, open => {
    if (!import.meta.client) return
    if (open) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else unlockScroll()
  })
  const trapFocus = (event: KeyboardEvent) => {
    if (!isOpen.value) return
    const elements = Array.from(rootRef.value?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
      .filter(element => element.getClientRects().length > 0)
    const first = elements[0]
    const last = elements.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
  onBeforeUnmount(unlockScroll)
  watch(() => route.fullPath, close)
  const pointerOutside = (event: PointerEvent) => { if (isOpen.value && event.target instanceof Node && !rootRef.value?.contains(event.target)) close() }
  onBeforeUnmount(() => document.removeEventListener('pointerdown', pointerOutside))
  onMounted(() => {
    document.addEventListener('pointerdown', pointerOutside)
    const media = window.matchMedia(`(min-width: ${breakpoints.desktop.min}px)`)
    const changed = () => { if (media.matches) close() }
    media.addEventListener('change', changed)
    onBeforeUnmount(() => media.removeEventListener('change', changed))
  })
  return { isOpen, toggle, close, closeAndFocus, trapFocus }
}
