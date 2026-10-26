<script setup lang="ts">
import type { AboutHistorySettings } from '#shared/types/about-history'
import { defaultAboutHistory } from '#shared/config/default-about-history'
const { data: content } = await useFetch<AboutHistorySettings>('/api/about-history', { key: 'site-about-history', default: () => structuredClone(defaultAboutHistory) })
</script>

<template>
  <section v-if="content.cards.length" aria-labelledby="about-history-title" class="about-history mt-16 min-w-0 overflow-hidden tablet:mt-24 desktop:mt-40">
    <SharedCardSlider :items="content.cards" :title="content.title" region-id="about-history-title" item-class="basis-[88%] ps-5 tablet:basis-[60%] desktop:basis-[43%]" carousel-class="about-history-carousel mt-14 tablet:mt-20 desktop:mt-32" previous-label="Предыдущие события истории компании" next-label="Следующие события истории компании">
      <template #default="{ item }"><AboutHistoryCard :card="item" /></template>
    </SharedCardSlider>
  </section>
</template>
