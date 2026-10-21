import { breakpoints } from '#shared/config/breakpoints'

// Touch layouts keep all text visible; disclosure is only useful with a desktop pointer.
export function useHoverDisclosure() {
  const canCollapse = ref(false)
  let media: MediaQueryList | undefined
  const update = () => { canCollapse.value = media?.matches ?? false }
  onMounted(() => {
    media = window.matchMedia(`(min-width: ${breakpoints.desktop.min}px) and (hover: hover) and (pointer: fine)`)
    update()
    media.addEventListener('change', update)
  })
  onBeforeUnmount(() => media?.removeEventListener('change', update))
  return { canCollapse }
}
