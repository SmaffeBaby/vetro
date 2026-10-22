<script setup lang="ts">
import type { FaqBenefit } from '#shared/types/faq.ts'
import { mediaUrl } from '#shared/utils/media.ts'
defineProps<{ benefits: FaqBenefit[] }>()
const iconSrc = (item: FaqBenefit) => item.iconPath ? mediaUrl(item.iconPath) : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.svg)}`
</script>

<template>
  <aside aria-label="Наши преимущества" class="min-w-0 rounded-[20px] bg-linear-to-r from-site-brand to-site-brand-light p-7 text-white tablet:p-10">
    <ul class="space-y-10 tablet:space-y-12">
      <li v-for="item in benefits" :key="item.id" class="flex items-start gap-4">
        <img v-if="item.svg" :src="iconSrc(item)" alt="" aria-hidden="true" width="24" height="24" class="mt-1.5 block size-6 shrink-0 object-contain">
        <div class="min-w-0"><h3 class="whitespace-pre-line text-lg font-semibold leading-normal [overflow-wrap:anywhere]">{{ item.title }}</h3><p class="whitespace-pre-line text-sm leading-relaxed [overflow-wrap:anywhere]">{{ item.text }}</p></div>
      </li>
    </ul>
  </aside>
</template>
