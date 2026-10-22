<script setup lang="ts">
import type { HeaderMenuItem } from '#shared/types/header'
defineProps<{ items: HeaderMenuItem[] }>()
const { isOpen, toggle, close, closeAndFocus } = useHeaderMenu()
const emit = defineEmits<{ 'update:open': [open: boolean] }>()
watch(isOpen, open => emit('update:open', open))
</script>

<template>
  <div ref="menuRoot" class="order-3 desktop:order-2 desktop:min-w-0" @keydown.esc.stop.prevent="closeAndFocus">
    <button ref="menuToggle" type="button" :aria-expanded="isOpen" aria-controls="header-navigation" :aria-label="isOpen ? 'Закрыть меню' : 'Открыть меню'" class="flex size-11 items-center justify-center rounded-lg text-site-charcoal hover:bg-site-surface desktop:hidden" @click="toggle">
      <UIcon :name="isOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="size-6" />
    </button>
    <div id="header-navigation" :class="isOpen ? 'block' : 'hidden'" class="absolute inset-x-0 top-full border-t border-site-line bg-white px-5 py-5 shadow-lg desktop:static desktop:block desktop:border-0 desktop:p-0 desktop:shadow-none">
      <nav aria-label="Основная навигация" class="site-header-nav flex flex-col gap-y-5 desktop:flex-row desktop:flex-wrap desktop:items-center desktop:justify-center desktop:gap-y-2 desktop:-translate-x-[clamp(12.5px,1.041667vw,20px)] desktop:translate-y-0.5">
        <NuxtLink v-for="item in items" :key="item.id" :to="item.href" class="site-header-menu-link whitespace-nowrap font-medium leading-normal text-site-charcoal transition-colors hover:text-site-brand" @click="close">{{ item.label }}</NuxtLink>
      </nav>
      <div class="mt-6 tablet:hidden"><slot /></div>
    </div>
  </div>
</template>
