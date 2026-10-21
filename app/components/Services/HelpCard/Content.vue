<script setup lang="ts">
withDefaults(defineProps<{ title: string; text: string; buttonLabel: string; headingId?: string; centered?: boolean }>(), { headingId: 'services-help-card-title', centered: false })
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <div class="min-w-0" :class="{ 'relative z-10 w-full text-center': centered }">
    <h2 :id="headingId" class="whitespace-pre-line leading-[1.2] [overflow-wrap:anywhere]" :class="centered ? 'text-[32px] font-bold tablet:text-[40px] desktop:text-[clamp(40px,2.9167vw,56px)]' : 'text-[28px] font-medium tablet:text-[32px] desktop:text-[clamp(32px,2.0833vw,40px)]'">{{ title }}</h2>
    <p class="mt-5 whitespace-pre-line leading-[1.25] [overflow-wrap:anywhere]" :class="centered ? 'mx-auto max-w-[1200px] text-lg font-medium text-white tablet:text-xl desktop:text-2xl' : 'text-base font-semibold text-[#91a4ba] tablet:text-lg desktop:text-xl'">{{ text }}</p>
    <HeaderButton :label="buttonLabel" :appearance="centered ? 'light' : 'primary'" :show-arrow="!centered" class="help-card-button" :class="centered ? 'mx-auto mt-8' : 'mt-6'" @click="emit('request')" />
  </div>
</template>

<style scoped>
.help-card-button { width: auto; max-width: 100%; padding-inline: 22px; }
.help-card-button :deep(span) { overflow-wrap: anywhere; }
</style>
