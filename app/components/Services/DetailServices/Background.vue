<script setup lang="ts">
import { mediaUrl } from '#shared/utils/media'
const props = defineProps<{ svg: string; path: string | null }>()
const src = computed(() => props.path ? mediaUrl(props.path) : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(props.svg)}`)
</script>

<template>
  <img v-if="svg" :src="src" alt="" aria-hidden="true" width="800" height="800" class="detail-background pointer-events-none absolute -right-[30%] top-32 h-[500px] w-[500px] max-w-none select-none object-contain opacity-[0.07] tablet:-right-[23%] tablet:top-28 tablet:size-[700px] desktop:-right-[10%] desktop:top-24 desktop:size-[850px]">
</template>
