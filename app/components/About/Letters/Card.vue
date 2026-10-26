<script setup lang="ts">
import type { AboutLetter } from '#shared/types/about-letters'
defineProps<{ card: AboutLetter }>()
</script>

<template>
  <article class="about-letter flex min-w-0 flex-col rounded-[32px] bg-site-surface p-6 [overflow-wrap:anywhere] tablet:p-8 desktop:rounded-[40px] desktop:p-12">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0 flex-1"><h3 class="text-xl font-medium leading-snug tablet:text-2xl">{{ card.organization }}</h3><p class="mt-1 text-base leading-snug text-site-muted">{{ card.reference }}</p></div>
      <span v-if="card.tag" class="max-w-full rounded-xl bg-white px-3 py-2 text-sm font-medium leading-snug text-site-brand">{{ card.tag }}</span>
    </div>
    <blockquote class="mt-6 flex flex-1 flex-col"><p class="whitespace-pre-line text-base font-medium leading-snug">{{ card.text }}</p><footer class="mt-auto pt-8 text-base leading-snug"><cite class="whitespace-pre-line font-bold not-italic">{{ card.author }}</cite><p class="mt-1 whitespace-pre-line text-site-muted">{{ card.position }}</p></footer></blockquote>
  </article>
</template>
