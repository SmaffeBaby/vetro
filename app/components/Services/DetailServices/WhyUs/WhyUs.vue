<script setup lang="ts">
import type { ServicesWhyUsSettings } from '#shared/types/services-why-us'
import { defaultServicesWhyUs } from '#shared/config/default-services-why-us'
const { data: content } = await useFetch<ServicesWhyUsSettings>('/api/services-why-us', { key: 'site-services-why-us', default: () => structuredClone(defaultServicesWhyUs) })
</script>

<template>
  <section v-if="content.cards.length" aria-labelledby="services-why-us-title" class="mx-auto max-w-480 px-5 pb-16 text-[#203e63] tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pb-32">
    <div class="rounded-[28px] bg-white px-6 py-10 tablet:rounded-[40px] tablet:p-10 desktop:px-12 desktop:py-14">
      <h2 id="services-why-us-title" class="whitespace-pre-line break-words text-3xl font-bold leading-[1.12] tablet:text-[42px] desktop:text-[60px]">{{ content.title }}</h2>
      <div class="mt-10 grid grid-cols-1 gap-10 tablet:mt-16 tablet:grid-cols-2 tablet:gap-10 desktop:mt-24 desktop:grid-cols-4 desktop:gap-12">
        <ServicesDetailServicesWhyUsCard v-for="card in content.cards" :key="card.id" :card="card" />
      </div>
    </div>
  </section>
</template>
