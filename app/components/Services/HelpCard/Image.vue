<script setup lang="ts">
import { mediaUrl } from '#shared/utils/media'
const props = defineProps<{ svg: string; path: string | null }>()
const src = computed(() => props.path ? mediaUrl(props.path) : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(props.svg)}`)
</script>

<template>
  <img :src="src" alt="" aria-hidden="true" width="616" height="112" class="block max-h-48 w-full min-w-0 max-w-[616px] justify-self-center object-contain desktop:justify-self-end">
</template>
