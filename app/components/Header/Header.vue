<script setup lang="ts">
const { data: header } = await useHeader()
const emit = defineEmits<{ request: [] }>()
const hidden = ref(false)
const menuOpen = ref(false)
const headerElement = ref<HTMLElement | null>(null)
let anchor = 0
function onScroll() {
  const y = Math.max(0, window.scrollY)
  if (y <= (headerElement.value?.offsetHeight || 140) || menuOpen.value || headerElement.value?.querySelector(':focus-visible')) {
    hidden.value = false
    anchor = y
    return
  }
  if (Math.abs(y - anchor) < 12) return
  hidden.value = y > anchor
  anchor = y
}
watch(menuOpen, open => { if (open) hidden.value = false })
onMounted(() => { anchor = window.scrollY; window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="sticky top-0 z-50" :class="{ 'pointer-events-none': hidden }">
  <header ref="headerElement" :inert="hidden" class="site-header relative z-20 bg-white transition-transform duration-300 ease-out motion-reduce:transition-none" :class="hidden ? '-translate-y-full' : 'translate-y-0'">
    <div class="relative mx-auto grid min-h-22 max-w-480 grid-cols-[1fr_auto_auto] items-center gap-x-4 px-5 tablet:min-h-28 tablet:px-8 desktop:min-h-35 desktop:grid-cols-[auto_minmax(0,1fr)_auto] desktop:gap-x-6 desktop:px-[4.95%]">
      <HeaderLogo :svg="header.logoSvg" :path="header.logoPath" />
      <HeaderMenu :items="header.menuItems" @update:open="menuOpen = $event">
        <HeaderButton :label="header.buttonLabel" @click="emit('request')" />
      </HeaderMenu>
      <div class="order-2 hidden tablet:block desktop:order-3">
        <HeaderButton :label="header.buttonLabel" @click="emit('request')" />
      </div>
    </div>
  </header>
  </div>
</template>
