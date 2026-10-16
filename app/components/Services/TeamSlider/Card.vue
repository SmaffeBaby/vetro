<script setup lang="ts">
import type { TeamCard } from '#shared/types/services-team'
import { mediaUrl } from '#shared/utils/media'
defineProps<{ card: TeamCard }>()
</script>
<template>
 <article class="min-w-0 [overflow-wrap:anywhere]">
  <div class="aspect-[417/600] overflow-hidden rounded-[32px] bg-gradient-to-r from-[#2a9ccf] to-[#7bd3ef]">
   <img v-if="card.imagePath" :src="mediaUrl(card.imagePath)" :alt="card.name" width="417" height="600" loading="lazy" draggable="false" class="h-full w-full object-cover" />
   <div v-else class="flex h-full items-center justify-center text-white/70" role="img" :aria-label="`Фото ${card.name} отсутствует`"><UIcon name="i-lucide-user-round" class="size-20" /></div>
  </div>
  <h3 class="mt-5 whitespace-pre-line text-xl font-medium leading-snug tablet:text-2xl">{{ card.name }}</h3>
  <p class="mt-1 whitespace-pre-line text-base leading-snug text-[#94a3b8]">{{ card.position }}</p>
  <p class="mt-5 whitespace-pre-line text-base font-medium leading-[1.4]">{{ card.description }}</p>
 </article>
</template>
