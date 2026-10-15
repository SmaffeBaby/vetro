<script setup lang="ts">
import type { AboutCardLeftItem } from '#shared/types/about-card'
defineProps<{ items: AboutCardLeftItem[] }>()
</script>

<template>
  <dl class="grid min-w-0 grid-cols-2 content-start gap-x-8 gap-y-9">
    <div v-for="item in items" :key="item.id" class="min-w-0">
      <dt class="about-card-number whitespace-pre-line font-medium leading-none">{{ item.title }}</dt>
      <dd class="mt-6 whitespace-pre-line text-base font-medium leading-normal tablet:mt-7 tablet:text-xl">{{ item.text }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.about-card-number { font-size: clamp(44px, 4.166667vw, 80px); overflow-wrap: anywhere; }
dd { overflow-wrap: anywhere; }
</style>
