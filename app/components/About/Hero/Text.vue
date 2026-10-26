<script setup lang="ts">
defineProps<{ subtitle: string; text: string }>()
</script>

<template>
  <div class="about-hero-text mt-10 grid gap-6 tablet:mt-14 desktop:mt-20 desktop:grid-cols-[0.65fr_1fr] desktop:gap-16">
    <h2 class="whitespace-pre-line text-[28px] font-medium leading-snug [overflow-wrap:anywhere] tablet:text-[36px] desktop:text-[40px]">{{ subtitle }}</h2>
    <div class="space-y-8 text-lg font-medium leading-snug tablet:text-xl desktop:space-y-12 desktop:text-2xl"><p v-for="(paragraph, index) in text.split(/\n\s*\n/)" :key="index" class="whitespace-pre-line [overflow-wrap:anywhere]">{{ paragraph }}</p></div>
  </div>
</template>
