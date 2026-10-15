import { breakpoints } from '#shared/config/breakpoints'

export function useHeaderMenu() {
  const isOpen = ref(false)
  const rootRef = useTemplateRef<HTMLElement>('menuRoot')
  const toggleRef = useTemplateRef<HTMLButtonElement>('menuToggle')
  const route = useRoute()
  const close = () => { isOpen.value = false }
  const closeAndFocus = () => { close(); toggleRef.value?.focus() }
  const toggle = () => { isOpen.value = !isOpen.value }
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
  return { isOpen, toggle, close, closeAndFocus }
}
