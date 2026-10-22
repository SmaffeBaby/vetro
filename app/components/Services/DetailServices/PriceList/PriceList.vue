<script setup lang="ts">
import type { ServicePriceSettings } from '#shared/types/services-prices'
import { createDefaultServicePrices } from '#shared/config/default-services-prices'
const props = defineProps<{ currentServiceId: string }>()
const emit = defineEmits<{ request: [] }>()
const { data: prices } = await useFetch<ServicePriceSettings>(`/api/services-prices/${encodeURIComponent(props.currentServiceId)}`, { key: `site-services-prices-${props.currentServiceId}`, default: () => createDefaultServicePrices(props.currentServiceId) })
</script>

<template>
  <section aria-labelledby="service-prices-title" class="mx-auto max-w-480 px-5 pb-16 text-site-ink tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pb-32">
    <ServicesDetailServicesPriceListHeading :title="prices.title" :description="prices.description" :button-label="prices.buttonLabel" @request="emit('request')" />
    <ServicesDetailServicesPriceListRows v-if="prices.rows.length" :rows="prices.rows" class="mt-8 tablet:mt-10 desktop:mt-12" />
  </section>
</template>
