<script setup lang="ts">
defineProps<{ label: string; secondary?: boolean; href?: string }>()
</script>

<template>
  <component :is="href ? 'a' : 'button'" :href="href" :type="href ? undefined : 'button'" class="hero-button inline-flex max-w-full min-h-[70px] items-center justify-center gap-5 rounded-lg border px-7 py-5 text-base font-semibold leading-normal transition-colors" :class="secondary ? 'w-[232px] border-[#203e63] bg-white text-[#203e63] hover:bg-sky-50' : 'w-[352px] border-transparent bg-[#2a9ccf] text-white shadow-[0_10px_18px_rgba(0,0,0,0.15)] hover:bg-[#238cbb]'">
    <span>{{ label }}</span>
    <img src="/images/header/arrow.svg" alt="" width="19.2882" height="12.216" class="shrink-0" :class="{ 'hero-secondary-arrow': secondary }" aria-hidden="true">
  </component>
</template>

<style scoped>
.hero-secondary-arrow { filter: brightness(0) saturate(100%) invert(20%) sepia(28%) saturate(1151%) hue-rotate(173deg) brightness(94%) contrast(89%); }
</style>
