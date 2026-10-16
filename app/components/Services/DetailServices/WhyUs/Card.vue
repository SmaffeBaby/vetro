<script setup lang="ts">
import type { ServiceWhyUsCard } from '#shared/types/services-why-us'
defineProps<{ card: ServiceWhyUsCard }>()
</script>

<template>
  <article class="min-w-0 [overflow-wrap:anywhere]">
    <h3 class="whitespace-pre-line text-[44px] font-bold leading-[1.1] text-[#43b2dc] tablet:text-[52px] desktop:text-[60px]">{{ card.title }}</h3>
    <p class="mt-1 whitespace-pre-line text-base font-medium leading-snug text-[#94a3b8]">{{ card.caption }}</p>
    <p class="mt-6 whitespace-pre-line text-base font-medium leading-[1.4] tablet:mt-8">{{ card.description }}</p>
  </article>
</template>
