<script setup lang="ts">
defineProps<{ title: string; text: string; buttonLabel: string }>()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <div class="min-w-0">
    <h2 id="services-help-card-title" class="whitespace-pre-line text-[28px] font-medium leading-[1.2] [overflow-wrap:anywhere] tablet:text-[32px] desktop:text-[clamp(32px,2.0833vw,40px)]">{{ title }}</h2>
    <p class="mt-5 whitespace-pre-line text-base font-semibold leading-[1.25] text-[#91a4ba] [overflow-wrap:anywhere] tablet:text-lg desktop:text-xl">{{ text }}</p>
    <HeaderButton :label="buttonLabel" class="help-card-button mt-6" @click="emit('request')" />
  </div>
</template>

<style scoped>
.help-card-button { width: auto; max-width: 100%; padding-inline: 22px; }
.help-card-button :deep(span) { overflow-wrap: anywhere; }
</style>
