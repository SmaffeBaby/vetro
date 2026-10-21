<script setup lang="ts">
import type { SiteObject } from '#shared/types/objects'
import { objectHref } from '#shared/utils/objects'
import { mediaUrl } from '#shared/utils/media'
withDefaults(defineProps<{object:SiteObject;buttonLabel?:string;variant?:'catalog'|'related';headingTag?:'h2'|'h3'}>(),{buttonLabel:'Подробнее',variant:'catalog'})
</script>
<template>
 <article class="flex min-w-0 flex-col" :class="variant==='catalog'?'rounded-[32px] bg-white p-4 tablet:p-5':''">
  <NuxtLink :to="objectHref(object.id)" :aria-label="object.title" class="block overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]" :class="variant==='related'?'rounded-[32px]':'rounded-[20px]'"><img v-if="object.imagePath" :src="mediaUrl(object.imagePath)" :alt="object.title" width="523" height="300" loading="lazy" class="w-full object-cover transition-transform duration-300 hover:scale-[1.03]" :class="variant==='related'?'aspect-[2/1]':'aspect-[523/300]'" /><div v-else class="flex items-center justify-center bg-[#eaf6fc]" :class="variant==='related'?'aspect-[2/1]':'aspect-[523/300]'"><UIcon name="i-lucide-building-2" class="size-16 text-[#2a9ccf]" /></div></NuxtLink>
  <component :is="headingTag || (variant==='related'?'h3':'h2')" class="mt-6 text-xl font-semibold leading-[1.2] [overflow-wrap:anywhere]" :class="variant==='catalog'?'tablet:text-[22px]':'px-5'"><NuxtLink :to="objectHref(object.id)">{{ object.title }}</NuxtLink></component>
  <p class="mt-2 text-base font-medium leading-snug" :class="variant==='related'?'px-5 text-[#8c9098]':'text-[#94a3b8]'">{{ variant==='related'?(object.subtitle||object.address):object.address }}</p>
  <div v-if="variant==='catalog'" class="mt-auto pt-12 tablet:pt-16"><NuxtLink :to="objectHref(object.id)" class="block rounded-2xl border border-[#2a9ccf] px-4 py-2 text-center text-sm font-semibold text-[#2a9ccf] transition-colors hover:bg-[#eaf6fc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]">{{ buttonLabel }}</NuxtLink></div>
 </article>
</template>
