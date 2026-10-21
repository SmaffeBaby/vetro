<script setup lang="ts">
import { aboutHeroImageUrl } from '#shared/utils/about-hero'
defineProps<{ path: string | null; alt: string }>()
</script>

<template>
  <img v-if="path" :src="aboutHeroImageUrl(path)" :alt="alt" width="1730" height="1154" fetchpriority="high" decoding="async" class="mt-12 block h-auto w-full rounded-[24px] tablet:mt-16 tablet:rounded-[32px] desktop:mt-24 desktop:rounded-[40px]" />
</template>
