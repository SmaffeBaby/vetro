<script setup lang="ts">
import type { ServiceIncludedSettings } from '#shared/types/services-included'
import type { ServiceDetailPage } from '#shared/types/services-detail'
import { serviceIdSchema, serviceDetailHref } from '#shared/utils/services-detail'

definePageMeta({ key: route => route.path })
const route = useRoute()
const id = String(route.params.id), itemId = String(route.params.item)
if (!serviceIdSchema.safeParse(id).success || !serviceIdSchema.safeParse(itemId).success) throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
const [{ data: content, error }, { data: service, error: serviceError }] = await Promise.all([
  useFetch<ServiceIncludedSettings>(`/api/services-included/${encodeURIComponent(id)}`, { key: `site-services-included-${id}` }),
  useFetch<ServiceDetailPage>(`/api/services-detail/${encodeURIComponent(id)}`, { key: `site-services-detail-${id}` })
])
if (error.value || serviceError.value) throw createError({ statusCode: error.value?.statusCode || serviceError.value?.statusCode || 503, statusMessage: 'Не удалось загрузить страницу' })
const item = computed(() => content.value?.items.find(item => item.id === itemId))
if (!item.value || !service.value) throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
useHead({ title: () => `${item.value?.detailTitle} · Ветро`, meta: [{ name: 'description', content: () => item.value?.detailText || '' }] })
</script>

<template>
  <div v-if="item && service" class="service-item-page min-h-screen bg-[#f7f8fa] text-[#203e63]">
    <Header @request="navigateTo('/#contacts')" />
    <main>
      <section class="relative overflow-hidden" aria-labelledby="service-detail-title">
        <ServicesDetailServicesBackground :svg="service.svg" :path="service.imagePath" />
        <div class="relative mx-auto max-w-480 px-5 pt-8 tablet:px-8 tablet:pt-10 desktop:px-[4.95%] desktop:pt-12">
          <SharedBreadcrumbs :items="[{ label: 'Главная', to: '/' }, { label: 'Услуги', to: '/services' }, { label: service.breadcrumb, to: serviceDetailHref(id) }, { label: item.title }]" />
          <ServicesDetailServicesHero :title="item.detailTitle" :text="item.detailText" :button-label="item.buttonLabel" @request="navigateTo('/#contacts')" />
        </div>
      </section>
      <div v-if="item.body" class="mx-auto max-w-480 whitespace-pre-line px-5 pb-16 text-lg leading-relaxed tablet:px-8 tablet:pb-24 desktop:px-[4.95%]">{{ item.body }}</div>
      <ServicesDetailServicesRequestCard :current-service-id="id" @request="navigateTo('/#contacts')" />
    </main>
    <Footer @request="navigateTo('/#contacts')" />
  </div>
</template>

<style scoped>
.service-item-page { font-family: Montserrat, sans-serif; }
.service-item-page :deep(.site-header), .service-item-page :deep(#header-navigation) { background-color: #f7f8fa; }
</style>
