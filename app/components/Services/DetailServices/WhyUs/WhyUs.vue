<script setup lang="ts">
import type { ServicesWhyUsSettings } from '#shared/types/services-why-us'
import { defaultServicesWhyUs } from '#shared/config/default-services-why-us'
const { data: content } = await useFetch<ServicesWhyUsSettings>('/api/services-why-us', { key: 'site-services-why-us', default: () => structuredClone(defaultServicesWhyUs) })
</script>

<template>
  <section v-if="content.cards.length" aria-labelledby="services-why-us-title" class="mx-auto max-w-480 px-5 pb-16 text-site-ink tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pb-32">
    <h2 id="services-why-us-title" class="whitespace-pre-line break-words text-[32px] font-bold leading-[1.1] tablet:text-[40px] desktop:text-[clamp(40px,2.9167vw,56px)]">{{ content.title }}</h2>
    <ol class="mt-10 grid list-none grid-cols-1 gap-5 tablet:mt-14 tablet:grid-cols-2">
      <ServicesDetailServicesWhyUsCard v-for="(card, index) in content.cards" :key="card.id" :card="card" :number="index + 1" />
    </ol>
  </section>
</template>
