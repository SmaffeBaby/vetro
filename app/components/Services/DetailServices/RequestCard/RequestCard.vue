<script setup lang="ts">
import type { ServiceRequestSettings } from '#shared/types/services-request'
import { createDefaultServiceRequest } from '#shared/config/default-services-request'
const props = defineProps<{ currentServiceId: string }>()
const emit = defineEmits<{ request: [] }>()
const { data: request } = await useFetch<ServiceRequestSettings>(`/api/services-request/${encodeURIComponent(props.currentServiceId)}`, { key: `site-services-request-${props.currentServiceId}`, default: () => createDefaultServiceRequest(props.currentServiceId) })
</script>

<template>
  <section aria-labelledby="service-request-title" class="mx-auto max-w-480 px-5 pb-16 tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pb-32">
    <div class="service-request-card grid min-w-0 items-center gap-10 rounded-[28px] bg-site-ink p-7 text-white tablet:rounded-[40px] tablet:p-10 desktop:gap-20 desktop:px-[4.1%] desktop:py-16" :class="request.svg ? 'desktop:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]' : ''">
      <ServicesDetailServicesRequestCardContent :title="request.title" :description="request.description" :note="request.note" :button-label="request.buttonLabel" @request="emit('request')" />
      <ServicesDetailServicesRequestCardImage v-if="request.svg" :svg="request.svg" :path="request.imagePath" />
    </div>
  </section>
</template>
