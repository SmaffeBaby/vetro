<script setup lang="ts">
import type { SiteObject } from '#shared/types/objects'
import { objectHref } from '#shared/utils/objects'
import { mediaUrl } from '#shared/utils/media'
withDefaults(defineProps<{object:SiteObject;buttonLabel?:string;variant?:'catalog'|'related'|'home';headingTag?:'h2'|'h3'}>(),{buttonLabel:'Подробнее',variant:'catalog'})
</script>
<template>
 <article class="object-card text-site-ink flex min-w-0 flex-col rounded-[32px]" :class="variant==='related'?'bg-white pb-6':['p-4 tablet:p-5',variant==='home'?'bg-site-surface':'bg-white']">
  <NuxtLink :to="objectHref(object.id)" :aria-label="object.title" class="block overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-brand" :class="variant==='related'?'rounded-[32px]':'rounded-[20px]'"><img v-if="object.imagePath" :src="mediaUrl(object.imagePath)" :alt="object.title" width="523" height="300" loading="lazy" class="w-full object-cover transition-transform duration-300 hover:scale-[1.03]" :class="variant==='related'?'aspect-[2/1]':variant==='home'?'aspect-[10/7]':'aspect-[523/300]'" /><div v-else class="flex items-center justify-center bg-site-brand-tint" :class="variant==='related'?'aspect-[2/1]':variant==='home'?'aspect-[10/7]':'aspect-[523/300]'"><UIcon name="i-lucide-building-2" class="size-16 text-site-brand" /></div></NuxtLink>
  <component :is="headingTag || (variant==='related'?'h3':'h2')" class="object-card-title mt-6 text-xl font-semibold leading-[1.2] [overflow-wrap:anywhere]" :class="variant==='related'?'px-5':'tablet:text-[22px]'"><NuxtLink :to="objectHref(object.id)">{{ object.title }}</NuxtLink></component>
  <p class="mt-2 text-base font-medium leading-snug" :class="variant==='related'?'px-5 text-site-muted':'text-site-muted'">{{ variant==='related'?(object.subtitle||object.address):object.address }}</p>
  <div v-if="variant!=='related'" class="mt-auto pt-12 tablet:pt-16"><NuxtLink :to="objectHref(object.id)" class="site-outline-button block rounded-2xl border border-site-brand px-4 py-2 text-center text-sm font-semibold text-site-brand transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-brand">{{ buttonLabel }}</NuxtLink></div>
 </article>
</template>
