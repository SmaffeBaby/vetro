<script setup lang="ts">
import { sortServiceCards } from '#shared/utils/services'
const { data: services } = await useServices()
const cards = computed(() => sortServiceCards(services.value.cards))
useHead({ title: () => `${services.value.title} · Ветро`, meta: [{ name: 'description', content: () => services.value.text }] })
</script>

<template>
  <div class="services-page min-h-screen bg-[#f7f8fa] text-[#203e63]">
    <Header @request="navigateTo('/#contacts')" />
    <main aria-labelledby="services-title" class="mx-auto max-w-480 px-5 pb-16 pt-12 tablet:px-8 tablet:pb-24 tablet:pt-16 desktop:px-[4.95%] desktop:pb-24 desktop:pt-20">
      <ServicesTitleAndText :title="services.title" :text="services.text" />
      <ServicesCards v-if="cards.length" :cards="cards" class="mt-12 tablet:mt-16 desktop:mt-20" />
    </main>
    <Footer @request="navigateTo('/#contacts')" />
  </div>
</template>

<style scoped>
.services-page { font-family: Montserrat, sans-serif; }
.services-page :deep(.site-header), .services-page :deep(#header-navigation) { background-color: #f7f8fa; }
.services-page :deep(.services-intro), .services-page :deep(.service-card) { animation: services-appear 650ms ease both; animation-delay: var(--reveal-delay, 0ms); }
@keyframes services-appear { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .services-page :deep(.services-intro), .services-page :deep(.service-card) { animation: none; } }
</style>
