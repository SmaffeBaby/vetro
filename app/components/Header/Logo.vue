<script setup lang="ts">
import { mediaUrl } from '#shared/utils/media'

const props = defineProps<{ svg: string; path?: string | null }>()
const preview = useHeaderLogo(() => props.svg)
const src = computed(() => props.path ? mediaUrl(props.path) : preview.value)
</script>

<template>
  <NuxtLink to="/" aria-label="Ветро — главная" class="order-1 block w-35 shrink-0 tablet:w-50 desktop:w-auto desktop:-translate-y-1">
    <img v-if="svg" :src="src" alt="Ветро" width="264" height="48" class="block h-auto w-full desktop:w-[clamp(180px,13.75vw,264px)]">
    <span v-else class="font-semibold text-site-charcoal">Ветро</span>
  </NuxtLink>
</template>
