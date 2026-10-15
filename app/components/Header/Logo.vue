<script setup lang="ts">
const props = defineProps<{ svg: string }>()
const src = useHeaderLogo(() => props.svg)
</script>

<template>
  <NuxtLink to="/" aria-label="Ветро — главная" class="order-1 block w-35 shrink-0 tablet:w-50 desktop:w-auto desktop:-translate-y-1">
    <img :src="src" alt="Ветро" width="264" height="48" class="block h-auto w-full desktop:w-[clamp(180px,13.75vw,264px)]">
  </NuxtLink>
</template>
