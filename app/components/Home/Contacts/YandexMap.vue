<script setup lang="ts">
import { defaultContactsPage } from '#shared/config/default-contacts'
withDefaults(defineProps<{ src?: string; href?: string; title?: string; variant?: 'card' | 'page' }>(), {
  src: defaultContactsPage.mapSrc, href: defaultContactsPage.mapHref, title: defaultContactsPage.mapTitle, variant: 'card'
})
</script>
<template>
  <div class="relative overflow-hidden bg-slate-100" :class="variant === 'page' ? 'min-h-[400px] rounded-[32px] tablet:min-h-[560px] desktop:min-h-[700px] desktop:rounded-[40px]' : 'min-h-80 rounded-[20px] tablet:min-h-[400px] desktop:min-h-full'">
    <a :href="href" target="_blank" rel="noopener noreferrer" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded focus:bg-white focus:p-3">{{ title }} — открыть Яндекс Карты</a>
    <iframe :src="src" :title="title" width="560" height="400" loading="lazy" allowfullscreen credentialless referrerpolicy="no-referrer" class="absolute inset-0 h-full w-full border-0" />
  </div>
</template>
