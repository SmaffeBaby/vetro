<script setup lang="ts">
defineProps<{ title: string; text: string }>()
</script>

<template>
  <div class="services-intro">
    <h1 id="services-title" class="whitespace-pre-line text-[36px] font-bold leading-[1.1] [overflow-wrap:anywhere] tablet:text-5xl desktop:text-[clamp(44px,2.9167vw,56px)]">{{ title }}</h1>
    <p class="mt-6 max-w-[1100px] whitespace-pre-line text-lg font-medium leading-[1.4] [overflow-wrap:anywhere] tablet:text-xl desktop:text-2xl">{{ text }}</p>
  </div>
</template>
