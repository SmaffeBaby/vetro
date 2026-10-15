<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <button type="button" class="site-header-cta flex min-h-15 shrink-0 items-center justify-center gap-[30px] rounded-lg bg-[#2a9ccf] px-[22px] py-[14px] text-base font-semibold leading-normal text-white shadow-[0_10px_12px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#238cbb] active:bg-[#1c7fae]">
    <span>{{ label }}</span>
    <img src="/images/header/arrow.svg" alt="" width="19.2882" height="12.216" class="block shrink-0" aria-hidden="true">
  </button>
</template>
