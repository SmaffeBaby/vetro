<script setup lang="ts">
import type { ServicePriceRow } from '#shared/types/services-prices'
defineProps<{ rows: ServicePriceRow[] }>()
</script>

<template>
  <dl aria-label="Прайс-лист услуг" class="space-y-1">
    <div v-for="row in rows" :key="row.id" class="price-row brand-gradient-hover flex min-h-24 min-w-0 flex-col justify-center gap-3 rounded-[20px] bg-white px-6 py-7 text-base font-semibold leading-[1.35] tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-8 tablet:px-8 desktop:min-h-28">
      <dt class="min-w-0 whitespace-pre-line text-site-charcoal [overflow-wrap:anywhere]">{{ row.name }}</dt>
      <dd class="min-w-0 whitespace-pre-line text-site-brand [overflow-wrap:anywhere] tablet:max-w-[40%] tablet:shrink-0 tablet:text-right">{{ row.price }}</dd>
    </div>
  </dl>
</template>
