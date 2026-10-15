<script setup lang="ts">
import type { FooterEntry } from '#shared/types/footer'
defineProps<{ items: FooterEntry[]; year: number }>()
</script>

<template>
  <ul class="flex min-w-0 flex-wrap gap-x-8 gap-y-4"><li v-for="item in items" :key="item.id" class="min-w-0"><FooterEntry :item="item" :year="year" /></li></ul>
</template>
