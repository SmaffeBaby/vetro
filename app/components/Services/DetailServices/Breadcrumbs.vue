<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <nav aria-label="Хлебные крошки" class="relative z-10 text-sm leading-relaxed text-[#a6afbc]">
    <ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
      <li><NuxtLink to="/" class="transition-colors hover:text-[#203e63] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]">Главная</NuxtLink></li>
      <li aria-hidden="true">/</li>
      <li><NuxtLink to="/services" class="transition-colors hover:text-[#203e63] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]">Услуги</NuxtLink></li>
      <li aria-hidden="true">/</li>
      <li class="text-[#647084] [overflow-wrap:anywhere]" aria-current="page">{{ label }}</li>
    </ol>
  </nav>
</template>
