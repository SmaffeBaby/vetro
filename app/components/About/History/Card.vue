<script setup lang="ts">
import type { AboutHistoryItem } from '#shared/types/about-history'
defineProps<{ card: AboutHistoryItem }>()
</script>

<template>
  <article class="flex h-full min-w-0 flex-col">
    <h3 class="bg-linear-to-r from-site-brand to-site-brand-light bg-clip-text text-[clamp(80px,12vw,180px)] font-bold leading-none tracking-tight text-transparent">{{ card.year }}</h3>
    <p class="mt-6 max-w-[420px] whitespace-pre-line text-sm font-medium leading-snug [overflow-wrap:anywhere] tablet:mt-8 tablet:text-base">{{ card.description }}</p>
    <div aria-hidden="true" class="mt-auto pt-14 tablet:pt-20">
      <div class="relative flex h-4 items-center before:absolute before:-right-5 before:left-5 before:top-1/2 before:h-px before:bg-site-line"><span class="relative size-3 shrink-0 rounded-full bg-linear-to-r from-site-brand to-site-brand-light" /></div>
    </div>
  </article>
</template>
