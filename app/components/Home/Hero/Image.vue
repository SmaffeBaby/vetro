<script setup lang="ts">
import { defaultHeroImagePath } from '#shared/config/default-hero'
import { heroImageUrl } from '#shared/utils/hero'

defineProps<{ path: string; alt: string }>()
</script>

<template>
  <img :src="heroImageUrl(path)" :alt="alt" :width="path === defaultHeroImagePath ? 1369 : 1100" :height="path === defaultHeroImagePath ? 975 : 620" fetchpriority="high" decoding="async" class="hero-image block h-auto w-full object-contain">
</template>
