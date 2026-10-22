<script setup lang="ts">
defineProps<{ label: string; secondary?: boolean; href?: string }>()
</script>

<template>
  <component :is="href ? 'a' : 'button'" :href="href" :type="href ? undefined : 'button'" class="hero-button inline-flex max-w-full min-h-[70px] items-center justify-center gap-5 rounded-lg border px-7 py-5 text-base font-semibold leading-normal transition-colors" :class="secondary ? 'site-outline-button w-[232px] border-site-brand bg-white text-site-brand' : 'w-[352px] border-transparent bg-site-brand text-white shadow-[0_10px_18px_rgba(0,0,0,0.15)] hover:bg-site-brand-hover'">
    <span>{{ label }}</span>
    <img src="/images/header/arrow.svg" alt="" width="19.2882" height="12.216" class="shrink-0" :class="{ 'hero-secondary-arrow': secondary }" aria-hidden="true">
  </component>
</template>

<style scoped>
.hero-secondary-arrow { filter: brightness(0) saturate(100%) invert(20%) sepia(28%) saturate(1151%) hue-rotate(173deg) brightness(94%) contrast(89%); }
.hero-button:focus-visible .hero-secondary-arrow { filter: none; }
@media (hover: hover) and (pointer: fine) { .hero-button:hover .hero-secondary-arrow { filter: none; } }
</style>
