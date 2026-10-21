<script setup lang="ts">
import type { ServiceDetailPage } from '#shared/types/services-detail'
import { serviceIdSchema } from '#shared/utils/services-detail'
definePageMeta({ key: route => route.path })
const route = useRoute()
const id = String(route.params.id)
if (!serviceIdSchema.safeParse(id).success) throw createError({ statusCode: 404, statusMessage: 'Услуга не найдена' })
const { data: detail, error } = await useFetch<ServiceDetailPage>(`/api/services-detail/${encodeURIComponent(id)}`, { key: `site-services-detail-${id}` })
if (error.value || !detail.value) throw createError({ statusCode: error.value?.statusCode || 503, statusMessage: error.value?.statusCode === 404 ? 'Услуга не найдена' : 'Не удалось загрузить услугу' })
useHead({ title: () => `${detail.value?.title} · Ветро`, meta: [{ name: 'description', content: () => detail.value?.text || '' }] })
</script>

<template>
  <div class="service-detail-page min-h-screen bg-[#f7f8fa] text-[#203e63]">
    <Header @request="navigateTo('/#contacts')" />
    <main><ServicesDetailServices v-if="detail" :detail="detail" @request="navigateTo('/#contacts')" /><ServicesDetailServicesObjects :current-service-id="id" /><ServicesDetailServicesWhyUs /><ServicesTeamSlider /><ServicesDetailServicesPriceList :current-service-id="id" @request="navigateTo('/#contacts')" /><ServicesDetailServicesRequestCard :current-service-id="id" @request="navigateTo('/#contacts')" /><ServicesDetailServicesOtherServices :current-service-id="id" /></main>
    <Footer @request="navigateTo('/#contacts')" />
  </div>
</template>

<style scoped>
.service-detail-page { font-family: Montserrat, sans-serif; }
.service-detail-page :deep(.site-header), .service-detail-page :deep(#header-navigation) { background-color: #f7f8fa; }
.service-detail-page :deep(.detail-hero) { animation: service-detail-appear 650ms ease both; }
@keyframes service-detail-appear { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .service-detail-page :deep(.detail-hero) { animation: none; } }
</style>
