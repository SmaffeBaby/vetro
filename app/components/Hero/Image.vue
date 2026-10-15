<script setup lang="ts">
import { mediaUrl } from '#shared/utils/media'
defineProps<{ path: string; alt: string }>()
</script>

<template>
  <img :src="mediaUrl(path)" :alt="alt" width="1100" height="620" fetchpriority="high" decoding="async" class="hero-image block h-auto w-full object-contain">
</template>
