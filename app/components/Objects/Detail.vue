<script setup lang="ts">
import type {SiteObject,ObjectsCatalog} from '#shared/types/objects'
import {mediaUrl} from '#shared/utils/media'
const props=defineProps<{object:SiteObject}>()
const {data:catalog}=await useSiteQuery<ObjectsCatalog>('/api/objects',{})
const {data:services}=await useServices()
const category=computed(()=>catalog.value?.settings.categories.find(c=>c.id===props.object.categoryId)?.label||'')
const activeServices=computed(()=>services.value.cards.filter(c=>props.object.serviceIds.includes(c.id)))
</script>
<template>
 <div class="object-detail-page min-h-screen bg-white text-site-ink">
  <Header @request="navigateTo('/#contacts')" />
  <main class="pb-16 pt-6 tablet:pb-24 desktop:pt-10">
   <div class="mx-auto max-w-480 px-5 tablet:px-8 desktop:px-[min(4.95%,95.04px)]">
   <NuxtLink to="/objects" class="inline-flex items-center gap-2 font-semibold text-site-charcoal tablet:hidden"><UIcon name="i-lucide-chevron-left" aria-hidden="true" class="size-4 text-site-ink" />Назад</NuxtLink>
   <SharedBreadcrumbs class="hidden tablet:block" :items="[{label:'Главная',to:'/'},{label:'Объекты',to:'/objects'},{label:object.title}]" />
   <div class="object-intro-grid mt-8 grid items-start gap-10 desktop:grid-cols-[1.08fr_1fr] desktop:gap-16">
    <div class="min-w-0">
     <ObjectsDetailText :title="object.title" :subtitle="object.subtitle" :description="object.description"><template #after-title><img v-if="object.imagePath" :src="mediaUrl(object.imagePath)" :alt="object.title" width="900" height="675" fetchpriority="high" class="object-hero-image mt-6 aspect-[4/3] w-full rounded-[28px] object-cover desktop:hidden" /></template></ObjectsDetailText>
     <ObjectsProperties :category="category" :service-count="activeServices.length" :area="object.area" :since-year="object.sinceYear" class="mt-10 tablet:mt-14" />
    </div>
    <img v-if="object.imagePath" :src="mediaUrl(object.imagePath)" :alt="object.title" width="900" height="675" class="hidden aspect-[4/3] w-full rounded-[40px] object-cover desktop:block" />
   </div>
   </div>
   <div class="object-equipment-services mt-16 bg-site-surface tablet:mt-24">
    <ObjectsEquipment :object-id="object.id" />
    <ObjectsServices :cards="activeServices" />
   </div>
   <ObjectsGallery :object-id="object.id" class="mx-auto mt-16 max-w-480 px-5 tablet:mt-24 tablet:px-8 desktop:px-[min(4.95%,95.04px)]" />
   <ObjectsResults :object-id="object.id" class="mt-16 tablet:mt-24" />
   <div class="mx-auto max-w-480 px-5 tablet:px-8 desktop:px-[min(4.95%,95.04px)]">
   <ObjectsOtherObjects :current-object-id="object.id" class="mt-16 tablet:mt-24" />
   <ObjectsRequestCard class="mt-16 tablet:mt-24" @request="navigateTo('/#contacts')" />
   </div>
  </main>
  <Footer @request="navigateTo('/#contacts')" />
 </div>
</template>

<style scoped>
.object-detail-page { font-family: Montserrat, sans-serif; }
@media (max-width: 767px) {
  .object-detail-page main { padding-top: 8px; padding-bottom: 60px; }
  .object-detail-page main > div { padding-inline: 10px; }
  .object-detail-page main > .object-equipment-services { padding-inline: 0; }
  .object-detail-page :deep(.object-detail-text) { display: flex; flex-direction: column; }
  .object-hero-image { order: -1; margin-top: 0; margin-bottom: 24px; border-radius: 20px; }
  .object-intro-grid { margin-top: 32px; }
  .object-detail-page :deep(.object-detail-text h1) { font-size: 32px; }
  .object-detail-page :deep(.object-detail-text > p:not(.object-description)) { font-weight: 600; }
  .object-detail-page :deep(.object-description) { margin-top: 24px; font-weight: 600; font-size: 18px; line-height: 1.5; }
  .object-detail-page :deep(.object-properties) { margin-top: 48px; gap: 10px; }
  .object-detail-page :deep(.object-properties > div) { padding: 20px; font-size: 18px; }
  .object-equipment-services { margin-top: 40px; }
  .object-detail-page :deep(.object-equipment) { padding-top: 72px; padding-bottom: 0; }
  .object-detail-page :deep(.object-equipment > div), .object-detail-page :deep(.object-services > div), .object-detail-page :deep(.object-results > div) { padding-inline: 10px; }
  .object-detail-page :deep(.object-equipment [role="region"]) { margin-top: 48px; }
  .object-detail-page :deep(.object-equipment th), .object-detail-page :deep(.object-equipment td) { padding: 20px; font-size: 14px; }
  .object-detail-page :deep(.object-equipment p) { margin-top: 24px; font-size: 18px; font-weight: 600; line-height: 1.5; }
  .object-detail-page :deep(.object-services) { padding-top: 72px; padding-bottom: 40px; }
  .object-detail-page :deep(.object-services .slider-item) { flex-basis: 75%; padding-inline-start: 5px; }
  .object-detail-page :deep(.object-services .slider-track) { margin-inline-start: -5px; }
  .object-detail-page :deep(.object-services .service-card-link) { min-height: 450px; padding: 24px; border-radius: 40px; }
  .object-detail-page :deep(.object-services .service-card-icon) { width: 80px; height: 80px; }
  .object-detail-page :deep(.object-services .service-card-icon + div) { margin-top: 40px; }
  .object-detail-page :deep(.object-services h3) { font-size: 20px; }
  .object-detail-page :deep(.object-gallery) { margin-top: 0; padding: 40px 10px 0; }
  .object-detail-page :deep(.object-gallery h2) { font-size: 32px; line-height: 1.1; }
  .object-detail-page :deep(.object-gallery > .relative) { margin-top: 24px; }
  .object-detail-page :deep(.object-gallery-arrow) { display: none; }
  .object-detail-page :deep(.object-gallery-thumbnails) { margin-top: 12px; gap: 5px; scrollbar-width: thin; scrollbar-color: var(--color-site-brand) var(--color-site-line); }
  .object-detail-page :deep(.object-results) { margin-top: 40px; padding-block: 48px; }
  .object-detail-page :deep(.object-results dl) { margin-top: 56px; gap: 48px; }
  .object-detail-page :deep(.object-results dd) { font-size: 60px; }
  .object-detail-page :deep(.other-objects) { margin-top: 48px; }
  .object-detail-page :deep(.other-objects-all) { display: none; }
  .object-detail-page :deep(.other-objects > .grid) { margin-top: 20px; gap: 10px; }
  .object-detail-page :deep(.other-objects .object-card) { padding: 20px; border-radius: 40px; background: var(--color-site-surface); }
  .object-detail-page :deep(.other-objects .object-card > a) { border-radius: 20px; }
  .object-detail-page :deep(.other-objects .object-card img), .object-detail-page :deep(.other-objects .object-card a > div) { aspect-ratio: 1.05; }
  .object-detail-page :deep(.other-objects .object-card-title) { margin-top: 30px; font-size: 20px; }
  .object-detail-page :deep(.other-objects .object-card-title), .object-detail-page :deep(.other-objects .object-card > p) { padding-inline: 0; }
  .object-detail-page :deep(.other-objects .object-card > div:last-child) { padding-top: 96px; padding-inline: 0; }
  .object-detail-page :deep(.other-objects .site-outline-button) { min-height: 48px; padding-block: 12px; border-radius: 20px; font-size: 16px; }
  .object-detail-page :deep(.object-request) { margin: 48px -10px 0; padding: 40px 10px; border-radius: 40px; text-align: center; gap: 40px; }
  .object-detail-page :deep(#objects-request-card-title) { font-size: 32px; line-height: 1.05; }
  .object-detail-page :deep(.object-request .help-card-button) { width: 100%; min-height: 60px; margin-top: 24px; }
}
@media (max-width: 359px) {
  .object-detail-page :deep(.object-request .help-card-button) { font-size: 14px; gap: 12px; }
}
</style>
