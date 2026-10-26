<script setup lang="ts">
import type { ServiceDetailPage } from '#shared/types/services-detail'
defineProps<{ detail: ServiceDetailPage }>()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <section aria-labelledby="service-detail-title" class="relative overflow-hidden">
    <ServicesDetailServicesBackground :svg="detail.svg" :path="detail.imagePath" />
    <div class="detail-intro relative mx-auto max-w-480 px-5 pt-8 tablet:px-8 tablet:pt-10 desktop:px-[4.95%] desktop:pt-12">
      <ServicesDetailServicesBreadcrumbs :label="detail.breadcrumb" />
      <ServicesDetailServicesHero :title="detail.title" :text="detail.text" :button-label="detail.buttonLabel" @request="emit('request')" />
    </div>
  </section>
</template>
