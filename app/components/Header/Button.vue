<script setup lang="ts">
withDefaults(defineProps<{ label: string; appearance?: 'primary' | 'light'; showArrow?: boolean }>(), { appearance: 'primary', showArrow: true })
</script>

<template>
  <button type="button" class="site-header-cta flex shrink-0 items-center justify-center gap-[30px] rounded-lg px-[22px] py-[14px] text-base font-semibold leading-normal transition-colors" :class="appearance === 'light' ? 'min-h-12 bg-white text-site-brand hover:bg-site-brand-tint active:bg-site-brand-tint' : 'min-h-15 bg-site-brand text-white shadow-[0_10px_12px_rgba(0,0,0,0.15)] hover:bg-site-brand-hover active:bg-site-brand-active'">
    <span>{{ label }}</span>
    <img v-if="showArrow" src="/images/header/arrow.svg" alt="" width="19.2882" height="12.216" class="block shrink-0" aria-hidden="true">
  </button>
</template>
