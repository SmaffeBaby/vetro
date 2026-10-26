<script setup lang="ts">
import type { ServicesWhyUsSettings } from '#shared/types/services-why-us'
import { defaultServicesWhyUs } from '#shared/config/default-services-why-us'
withDefaults(defineProps<{ variant?: 'benefits' | 'metrics' }>(), { variant: 'benefits' })
const { data: content } = await useFetch<ServicesWhyUsSettings>('/api/services-why-us', { key: 'site-services-why-us', default: () => structuredClone(defaultServicesWhyUs) })
</script>

<template>
  <section v-if="variant === 'metrics' && content.metrics.length" aria-labelledby="services-trust-title" class="detail-trust mx-auto max-w-480 pb-14 text-site-ink tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pb-32">
    <div class="rounded-[40px] bg-white px-[10px] py-14 tablet:p-10 desktop:p-14">
      <h2 id="services-trust-title" class="whitespace-pre-line break-words text-[32px] font-bold leading-[1.1] tablet:text-[40px] desktop:text-[clamp(40px,2.9167vw,56px)]">{{ content.metricsTitle }}</h2>
      <dl class="mt-12 grid grid-cols-1 gap-12 tablet:grid-cols-2 desktop:grid-cols-4">
        <div v-for="metric in content.metrics" :key="metric.id" class="min-w-0 [overflow-wrap:anywhere]">
          <dt><span class="block w-fit bg-linear-to-r from-site-brand to-site-brand-light bg-clip-text text-[60px] font-bold leading-none text-transparent">{{ metric.title }}</span><span v-if="metric.caption" class="mt-2 block text-base font-medium text-site-muted">{{ metric.caption }}</span></dt>
          <dd class="mt-6 whitespace-pre-line text-base font-medium leading-[1.4]">{{ metric.description }}</dd>
        </div>
      </dl>
    </div>
  </section>
  <section v-else-if="variant === 'benefits' && content.cards.length" aria-labelledby="services-why-us-title" class="detail-benefits mx-auto max-w-480 px-5 pb-16 text-site-ink tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pb-32">
    <h2 id="services-why-us-title" class="whitespace-pre-line break-words text-[32px] font-bold leading-[1.1] tablet:text-[40px] desktop:text-[clamp(40px,2.9167vw,56px)]">{{ content.title }}</h2>
    <ol class="mt-10 grid list-none grid-cols-1 gap-5 tablet:mt-14 tablet:grid-cols-2">
      <ServicesDetailServicesWhyUsCard v-for="(card, index) in content.cards" :key="card.id" :card="card" :number="index + 1" />
    </ol>
  </section>
</template>
