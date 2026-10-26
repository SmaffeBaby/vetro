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
  <div class="service-detail-page min-h-screen bg-site-surface text-site-ink">
    <Header @request="navigateTo('/#contacts')" />
    <main><ServicesDetailServices v-if="detail" :detail="detail" @request="navigateTo('/#contacts')" /><ServicesDetailServicesIncluded :current-service-id="id" /><ServicesDetailServicesObjects :current-service-id="id" class="pt-16 tablet:pt-24" /><ServicesDetailServicesWhyUs /><ServicesTeamSlider /><ServicesDetailServicesWhyUs variant="metrics" /><ServicesDetailServicesPriceList :current-service-id="id" @request="navigateTo('/#contacts')" /><ServicesDetailServicesRequestCard :current-service-id="id" @request="navigateTo('/#contacts')" /><ServicesDetailServicesOtherServices :current-service-id="id" /></main>
    <Footer @request="navigateTo('/#contacts')" />
  </div>
</template>

<style scoped>
.service-detail-page { font-family: Montserrat, sans-serif; }
.service-detail-page :deep(.site-header), .service-detail-page :deep(#header-navigation) { background-color: var(--color-site-surface); }
.service-detail-page :deep(.detail-hero) { animation: service-detail-appear 650ms ease both; }
@keyframes service-detail-appear { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .service-detail-page :deep(.detail-hero) { animation: none; } }
@media (max-width: 767px) {
  .service-detail-page :deep(.detail-intro) { padding: 8px 10px 0; }
  .service-detail-page :deep(.detail-background) { display: none; }
  .service-detail-page :deep(.detail-hero) { padding-top: 20px; padding-bottom: 40px; }
  .service-detail-page :deep(#service-detail-title) { font-size: 32px; overflow-wrap: normal; }
  .service-detail-page :deep(.detail-hero p) { margin-top: 20px; font-size: 18px; font-weight: 600; line-height: 1.5; }
  .service-detail-page :deep(.detail-hero-button) { width: 100%; min-height: 70px; margin-top: 32px; }
  .service-detail-page :deep(.detail-included) { padding-block: 40px; }
  .service-detail-page :deep(.detail-included > div) { padding-inline: 10px; }
  .service-detail-page :deep(#service-included-title + p) { font-weight: 600; line-height: 1.5; }
  .service-detail-page :deep(.detail-included .grid) { margin-top: 30px; gap: 10px; }
  .service-detail-page :deep(.included-card) { min-height: 416px; padding: 30px; border-radius: 40px; }
  .service-detail-page :deep(.included-card h3) { font-size: 20px; }
  .service-detail-page :deep(.included-card p) { line-height: 1.25; }
  .service-detail-page :deep(.included-card .site-outline-button), .service-detail-page :deep(.detail-objects .site-outline-button) { min-height: 48px; padding-block: 12px; border-radius: 20px; font-size: 16px; }
  .service-detail-page :deep(.detail-objects), .service-detail-page :deep(.detail-benefits), .service-detail-page :deep(.services-team), .service-detail-page :deep(.detail-prices), .service-detail-page :deep(.other-services) { padding-inline: 10px; padding-bottom: 56px; }
  .service-detail-page :deep(.detail-objects) { padding-top: 56px; }
  .service-detail-page :deep(.detail-objects .grid) { margin-top: 20px; gap: 10px; }
  .service-detail-page :deep(.detail-objects .object-card) { padding: 20px; border-radius: 40px; }
  .service-detail-page :deep(.detail-objects .object-card img), .service-detail-page :deep(.detail-objects .object-card a > div) { aspect-ratio: 1.05; }
  .service-detail-page :deep(.detail-objects .object-card-title) { margin-top: 30px; }
  .service-detail-page :deep(.detail-objects .object-card > div:last-child) { padding-top: 90px; }
  .service-detail-page :deep(.detail-benefits ol) { margin-top: 20px; gap: 10px; }
  .service-detail-page :deep(.detail-benefits li) { min-height: 270px; padding: 24px 20px; border-radius: 40px; }
  .service-detail-page :deep(.detail-benefits li > span) { font-size: 60px; }
  .service-detail-page :deep(.detail-benefits li p) { margin-top: 44px; }
  .service-detail-page :deep(.services-team .slider-item) { flex-basis: 75%; padding-inline-start: 5px; }
  .service-detail-page :deep(.slider-track) { margin-inline-start: -5px; }
  .service-detail-page :deep(.services-team h2 + p) { font-weight: 600; }
  .service-detail-page :deep(.services-team article > div) { border-radius: 20px; }
  .service-detail-page :deep(.carousel-arrow), .service-detail-page :deep(.carousel-arrow-icon) { width: 30px; height: 30px; }
  .service-detail-page :deep(.detail-prices .price-list-button) { display: none; }
  .service-detail-page :deep(.detail-prices p) { font-weight: 600; line-height: 1.5; }
  .service-detail-page :deep(.price-row) { padding: 16px; min-height: 100px; }
  .service-detail-page :deep(.detail-request) { padding-inline: 0; padding-bottom: 56px; }
  .service-detail-page :deep(.service-request-card) { padding: 40px 10px; border-radius: 40px; gap: 40px; }
  .service-detail-page :deep(#service-request-title) { font-size: 30px; text-align: center; }
  .service-detail-page :deep(#service-request-title + p) { text-align: center; }
  .service-detail-page :deep(.request-card-button) { width: 100%; min-height: 60px; }
  .service-detail-page :deep(.other-services .carousel-arrow) { display: none; }
  .service-detail-page :deep(.other-services .slider-item) { flex-basis: 80%; padding-inline-start: 5px; }
  .service-detail-page :deep(.other-services .service-card-link) { padding: 24px; border-radius: 40px; }
  .service-detail-page :deep(.other-services .service-card-icon) { width: 80px; height: 80px; }
  .service-detail-page :deep(.other-services .service-card-link h3) { font-size: 20px; }
  .service-detail-page :deep(.site-footer) { text-align: center; }
  .service-detail-page :deep(.site-footer p) { margin-inline: auto; }
  .service-detail-page :deep(.site-footer ul.flex) { justify-content: center; }
  .service-detail-page :deep(.site-footer .footer-cta) { margin-inline: auto; }
}
@media (max-width: 359px) {
  .service-detail-page :deep(.included-card) { padding-inline: 24px; }
  .service-detail-page :deep(.request-card-button) { font-size: 14px; gap: 12px; }
}
</style>
