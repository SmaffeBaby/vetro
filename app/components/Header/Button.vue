<script setup lang="ts">
withDefaults(defineProps<{ label: string; appearance?: 'primary' | 'light'; showArrow?: boolean }>(), { appearance: 'primary', showArrow: true })
</script>

<template>
  <button type="button" class="site-header-cta flex shrink-0 items-center justify-center gap-[30px] rounded-lg px-[22px] py-[14px] text-base font-semibold leading-normal transition-colors" :class="appearance === 'light' ? 'min-h-12 bg-white text-[#2a9ccf] hover:bg-[#eef9fd] active:bg-[#dff3fc]' : 'min-h-15 bg-[#2a9ccf] text-white shadow-[0_10px_12px_rgba(0,0,0,0.15)] hover:bg-[#238cbb] active:bg-[#1c7fae]'">
    <span>{{ label }}</span>
    <img v-if="showArrow" src="/images/header/arrow.svg" alt="" width="19.2882" height="12.216" class="block shrink-0" aria-hidden="true">
  </button>
</template>
