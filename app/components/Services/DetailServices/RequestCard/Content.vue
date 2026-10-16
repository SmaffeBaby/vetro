<script setup lang="ts">
defineProps<{ title: string; description: string; note: string; buttonLabel: string }>()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <div class="min-w-0">
    <h2 id="service-request-title" class="whitespace-pre-line text-[28px] font-medium leading-[1.1] [overflow-wrap:anywhere] tablet:text-[32px] desktop:text-[clamp(32px,2.0833vw,40px)]">{{ title }}</h2>
    <p class="mt-5 whitespace-pre-line text-base font-semibold leading-[1.25] text-[#91a4ba] [overflow-wrap:anywhere] tablet:text-lg desktop:text-xl">{{ description }}</p>
    <p v-if="note" class="mt-5 whitespace-pre-line rounded-xl bg-white/10 px-3 py-3 text-base font-semibold leading-[1.25] text-[#91a4ba] [overflow-wrap:anywhere] tablet:text-lg desktop:text-xl">{{ note }}</p>
    <HeaderButton :label="buttonLabel" class="request-card-button mt-5" @click="emit('request')" />
  </div>
</template>

<style scoped>
.request-card-button { width: 300px; max-width: 100%; }
.request-card-button :deep(span) { overflow-wrap: anywhere; }
</style>
