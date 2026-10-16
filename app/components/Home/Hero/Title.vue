<script setup lang="ts">
defineProps<{ title: string; accentTitle: string; text: string; regalia: string[] }>()
</script>

<template>
  <div>
    <h1 id="hero-title" class="hero-title whitespace-pre-line font-bold"><span>{{ title }}</span><span v-if="accentTitle" class="block text-[#2a9ccf]">{{ accentTitle }}</span></h1>
    <p v-if="text" class="mt-6 whitespace-pre-line text-base leading-relaxed tablet:text-lg">{{ text }}</p>
    <ul v-if="regalia.length" aria-label="Наши преимущества" class="hero-regalia mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-semibold tablet:mt-10">
      <li v-for="(item, index) in regalia" :key="index" class="flex items-center gap-3"><span v-if="index" aria-hidden="true">·</span><span>{{ item }}</span></li>
    </ul>
  </div>
</template>
