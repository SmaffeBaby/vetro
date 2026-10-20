<script setup lang="ts">
import type { SiteObject } from '#shared/types/objects'
import { objectHref } from '#shared/utils/objects'
import { mediaUrl } from '#shared/utils/media'
defineProps<{object:SiteObject;buttonLabel:string}>()
</script>
<template>
 <article class="flex min-w-0 flex-col rounded-[32px] bg-white p-4 tablet:p-5">
  <NuxtLink :to="objectHref(object.id)" :aria-label="object.title" class="block overflow-hidden rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]"><img v-if="object.imagePath" :src="mediaUrl(object.imagePath)" :alt="object.title" width="523" height="300" loading="lazy" class="aspect-[523/300] w-full object-cover transition-transform duration-300 hover:scale-[1.03]" /><div v-else class="flex aspect-[523/300] items-center justify-center bg-[#eaf6fc]"><UIcon name="i-lucide-building-2" class="size-16 text-[#2a9ccf]" /></div></NuxtLink>
  <h2 class="mt-6 text-xl font-semibold leading-[1.2] [overflow-wrap:anywhere] tablet:text-[22px]"><NuxtLink :to="objectHref(object.id)">{{ object.title }}</NuxtLink></h2>
  <p class="mt-2 text-base font-medium leading-snug text-[#94a3b8]">{{ object.address }}</p>
  <div class="mt-auto pt-12 tablet:pt-16"><NuxtLink :to="objectHref(object.id)" class="block rounded-2xl border border-[#2a9ccf] px-4 py-2 text-center text-sm font-semibold text-[#2a9ccf] transition-colors hover:bg-[#eaf6fc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]">{{ buttonLabel }}</NuxtLink></div>
 </article>
</template>
