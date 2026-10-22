<script setup lang="ts">
import type { FooterColumn } from '#shared/types/footer'
import { footerYearText } from '#shared/utils/footer-code'
defineProps<{ column: FooterColumn; year: number }>()
</script>

<template>
  <div class="min-w-0">
    <h2 class="mb-6 whitespace-pre-line text-base font-medium uppercase tracking-wider text-site-muted [overflow-wrap:anywhere]">{{ footerYearText(column.title, year) }}</h2>
    <ul class="space-y-3 text-base leading-[1.3]"><li v-for="item in column.items" :key="item.id"><FooterEntry :item="item" :year="year" /></li></ul>
  </div>
</template>
