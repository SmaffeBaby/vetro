<script setup lang="ts">
import type { AboutHistoryItem } from '#shared/types/about-history'
withDefaults(defineProps<{ card: AboutHistoryItem; isLast?: boolean }>(), { isLast: false })
</script>

<template>
  <article class="history-card flex h-full min-w-0 flex-col" :class="{ 'history-card-last': isLast }">
    <h3 class="bg-linear-to-r from-site-brand to-site-brand-light bg-clip-text text-[clamp(80px,12vw,180px)] font-bold leading-none tracking-tight text-transparent">{{ card.year }}</h3>
    <p class="mt-6 max-w-[420px] whitespace-pre-line text-sm font-medium leading-snug [overflow-wrap:anywhere] tablet:mt-8 tablet:text-base">{{ card.description }}</p>
    <div aria-hidden="true" class="mt-auto w-full pt-14 tablet:pt-20">
      <div class="history-track relative flex h-4 w-full items-center"><span class="relative size-3 shrink-0 rounded-full bg-linear-to-r from-site-brand to-site-brand-light" /></div>
    </div>
  </article>
</template>

<style scoped>
.history-track::before { content: ''; position: absolute; left: 20px; right: -20px; top: 50%; height: 1px; background: var(--color-site-line); }
.history-card-last { align-items: flex-end; text-align: right; }
.history-card-last .history-track { justify-content: flex-end; }
.history-card-last .history-track::before { left: -20px; right: 20px; }
@media (max-width: 767px) {
  .history-track::before { right: -5px; }
  .history-card-last .history-track::before { left: -5px; right: 20px; }
}
</style>
