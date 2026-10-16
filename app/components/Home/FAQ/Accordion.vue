<script setup lang="ts">
import type { FaqQuestion } from '#shared/types/faq.ts'
defineProps<{ questions: FaqQuestion[] }>()
</script>

<template>
  <div class="min-w-0">
    <details v-for="item in questions" :key="item.id" class="faq-question group border-b border-[#e3ebf3]">
      <summary class="flex min-h-[70px] cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-semibold leading-normal [overflow-wrap:anywhere]">
        <span>{{ item.question }}</span><UIcon name="i-lucide-chevron-down" class="size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <p class="whitespace-pre-line pb-6 pr-8 text-base leading-relaxed [overflow-wrap:anywhere]">{{ item.answer }}</p>
    </details>
  </div>
</template>

<style scoped>
summary::-webkit-details-marker { display: none; }
summary:focus-visible { outline: 2px solid #2a9ccf; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { summary :deep(svg), summary :deep(span) { transition: none; } }
</style>
