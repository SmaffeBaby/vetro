<script setup lang="ts">
import type { AboutLettersSettings } from '#shared/types/about-letters'
import { defaultAboutLetters } from '#shared/config/default-about-letters'
const { data: content } = await useFetch<AboutLettersSettings>('/api/about-letters', { key: 'site-about-letters', default: () => structuredClone(defaultAboutLetters) })
</script>

<template>
  <section v-if="content.cards.length" aria-labelledby="about-letters-title" class="mt-16 tablet:mt-24 desktop:mt-40">
    <h2 id="about-letters-title" class="whitespace-pre-line text-[32px] font-bold leading-tight [overflow-wrap:anywhere] tablet:text-[40px] desktop:text-[clamp(40px,2.9167vw,56px)]">{{ content.title }}</h2>
    <div class="mt-10 grid gap-5 tablet:mt-16 tablet:grid-cols-2"><AboutLettersCard v-for="card in content.cards" :key="card.id" :card="card" /></div>
  </section>
</template>
