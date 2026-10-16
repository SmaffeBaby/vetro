<script setup lang="ts">
defineProps<{ title: string; text: string; buttonLabel: string }>()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <div class="detail-hero relative z-10 pb-16 pt-16 tablet:pb-24 tablet:pt-28 desktop:pb-36 desktop:pt-40">
    <h1 id="service-detail-title" class="whitespace-pre-line text-[34px] font-bold leading-[1.1] [overflow-wrap:anywhere] tablet:text-[44px] desktop:text-[clamp(44px,3.125vw,60px)]">{{ title }}</h1>
    <p class="mt-8 max-w-[1250px] whitespace-pre-line text-lg font-medium leading-[1.4] [overflow-wrap:anywhere] tablet:mt-10 tablet:text-xl desktop:mt-12 desktop:text-[26px]">{{ text }}</p>
    <HeaderButton :label="buttonLabel" class="detail-hero-button mt-8 tablet:mt-10" @click="emit('request')" />
  </div>
</template>

<style scoped>
.detail-hero-button { width: 352px; max-width: 100%; }
.detail-hero-button :deep(span) { overflow-wrap: anywhere; }
</style>
