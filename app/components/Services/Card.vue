<script setup lang="ts">
import type { ServiceCard } from '#shared/types/services'
import { serviceDetailHref } from '#shared/utils/services-detail'
import { mediaUrl } from '#shared/utils/media'
withDefaults(defineProps<{ card: ServiceCard; headingTag?: 'h2' | 'h3' }>(), { headingTag: 'h2' })
const iconSrc = (card: ServiceCard) => card.iconPath ? mediaUrl(card.iconPath) : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(card.svg)}`
</script>

<template>
  <NuxtLink :to="serviceDetailHref(card.id)" draggable="false" class="service-card-link flex h-full min-w-0 flex-col rounded-[32px] bg-white p-7 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf] tablet:min-h-[360px] tablet:p-9 desktop:min-h-[400px] desktop:rounded-[40px] desktop:p-12" :aria-label="card.title">
      <div class="flex size-18 shrink-0 items-center justify-center rounded-[24px] bg-[#eef9fd] desktop:size-20"><img draggable="false" :src="iconSrc(card)" alt="" aria-hidden="true" width="40" height="40" class="size-10 object-contain"></div>
      <div class="mt-14 tablet:mt-auto tablet:pt-16"><component :is="headingTag" class="whitespace-pre-line text-lg font-semibold leading-[1.25] [overflow-wrap:anywhere] desktop:text-xl">{{ card.title }}</component><p class="mt-3 whitespace-pre-line text-base font-medium leading-[1.25] text-[#85898d] [overflow-wrap:anywhere]">{{ card.text }}</p></div>
      </NuxtLink>
</template>
