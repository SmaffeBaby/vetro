<script setup lang="ts">
defineProps<{ title: string; description: string; buttonLabel: string }>()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <div>
    <div class="flex flex-wrap items-start justify-between gap-6">
      <h2 id="service-prices-title" class="min-w-0 whitespace-pre-line text-[32px] font-bold leading-[1.1] [overflow-wrap:anywhere] tablet:text-[44px] desktop:text-[clamp(44px,3.125vw,60px)]">{{ title }}</h2>
      <button type="button" class="price-list-button inline-flex min-h-14 max-w-full items-center justify-center rounded-lg border border-[#2a9ccf] px-5 py-3 text-base font-semibold leading-normal text-[#2a9ccf] transition-colors hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]" @click="emit('request')"><span class="[overflow-wrap:anywhere]">{{ buttonLabel }}</span></button>
    </div>
    <p class="mt-6 max-w-[1320px] whitespace-pre-line text-lg font-medium leading-[1.4] [overflow-wrap:anywhere] tablet:text-xl desktop:text-[26px]">{{ description }}</p>
  </div>
</template>
