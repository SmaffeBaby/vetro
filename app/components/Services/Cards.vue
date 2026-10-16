<script setup lang="ts">
import type { ServiceCard } from '#shared/types/services'
import { mediaUrl } from '#shared/utils/media'
defineProps<{ cards: ServiceCard[] }>()
const iconSrc = (card: ServiceCard) => card.iconPath ? mediaUrl(card.iconPath) : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(card.svg)}`
</script>

<template>
  <ul aria-label="Услуги компании" class="grid gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
    <li v-for="(card, index) in cards" :key="card.id" class="service-card flex min-w-0 flex-col rounded-[32px] bg-white p-7 tablet:min-h-[360px] tablet:p-9 desktop:min-h-[400px] desktop:rounded-[40px] desktop:p-12" :style="{ '--reveal-delay': `${Math.min(index, 5) * 75}ms` }">
      <div class="flex size-18 shrink-0 items-center justify-center rounded-[24px] bg-[#eef9fd] desktop:size-20"><img :src="iconSrc(card)" alt="" aria-hidden="true" width="40" height="40" class="size-10 object-contain"></div>
      <div class="mt-14 tablet:mt-auto tablet:pt-16"><h2 class="whitespace-pre-line text-lg font-semibold leading-[1.25] [overflow-wrap:anywhere] desktop:text-xl">{{ card.title }}</h2><p class="mt-3 whitespace-pre-line text-base font-medium leading-[1.25] text-[#85898d] [overflow-wrap:anywhere]">{{ card.text }}</p></div>
    </li>
  </ul>
</template>
