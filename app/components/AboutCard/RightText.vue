<script setup lang="ts">
import type { AboutCardRightItem } from '#shared/types/about-card'
defineProps<{ items: AboutCardRightItem[] }>()
</script>

<template>
  <ul class="min-w-0 space-y-6 text-base leading-[1.6] text-white/90">
    <li v-for="item in items" :key="item.id" class="flex items-start gap-3">
      <span aria-hidden="true" class="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-[#2a9ccf]" />
      <span class="min-w-0 whitespace-pre-line [overflow-wrap:anywhere]">{{ item.text }}</span>
    </li>
  </ul>
</template>
