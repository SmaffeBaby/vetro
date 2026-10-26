<script setup lang="ts">
import { sortServiceCards } from '#shared/utils/services'
const { data: services } = await useServices()
const cards = computed(() => sortServiceCards(services.value.cards))
useHead({ title: () => `${services.value.title} · Ветро`, meta: [{ name: 'description', content: () => services.value.text }] })
</script>

<template>
  <div class="services-page min-h-screen bg-site-surface text-site-ink">
    <Header @request="navigateTo('/#contacts')" />
    <main aria-labelledby="services-title" class="mx-auto max-w-480 px-5 pb-16 pt-12 tablet:px-8 tablet:pb-24 tablet:pt-16 desktop:px-[4.95%] desktop:pb-24 desktop:pt-20">
      <ServicesTitleAndText :title="services.title" :text="services.text" />
      <ServicesCards v-if="cards.length" :cards="cards" class="mt-12 tablet:mt-16 desktop:mt-20" />
      <ServicesHelpCard class="mt-16 tablet:mt-20 desktop:mt-24" @request="navigateTo('/#contacts')" />
    </main>
    <Footer @request="navigateTo('/#contacts')" />
  </div>
</template>

<style scoped>
.services-page { font-family: Montserrat, sans-serif; }
.services-page :deep(.site-header), .services-page :deep(#header-navigation) { background-color: var(--color-site-surface); }
.services-page :deep(.services-intro), .services-page :deep(.service-card), .services-page :deep(.help-card) { animation: services-appear 650ms ease both; animation-delay: var(--reveal-delay, 0ms); }
@keyframes services-appear { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .services-page :deep(.services-intro), .services-page :deep(.service-card), .services-page :deep(.help-card) { animation: none; } }
@media (max-width: 767px) {
  .services-page main { padding: 40px 10px 60px; }
  .services-page :deep(.services-intro h1) { font-size: 32px; }
  .services-page :deep(.services-intro p) { margin-top: 20px; font-size: 18px; font-weight: 600; line-height: 1.5; }
  .services-page :deep(.services-cards) { gap: 10px; }
  .services-page :deep(.service-card), .services-page :deep(.service-card-link) { border-radius: 40px; }
  .services-page :deep(.service-card-link) { min-height: 360px; padding: 20px 20px 60px; }
  .services-page :deep(.service-card-icon) { width: 80px; height: 80px; border-radius: 28px; }
  .services-page :deep(.service-card-icon + div) { margin-top: 40px; }
  .services-page :deep(.service-card-link h2) { font-size: 20px; }
  .services-page :deep(.services-help-card) { margin: 56px -10px 0; padding: 40px 10px; gap: 40px; border-radius: 40px; text-align: center; }
  .services-page :deep(#services-help-card-title) { font-size: 32px; line-height: 1.05; font-weight: 500; }
  .services-page :deep(#services-help-card-title + p) { margin-top: 24px; font-size: 16px; line-height: 1.25; }
  .services-page :deep(.services-help-card .help-card-button) { width: 100%; min-height: 60px; margin-top: 24px; padding-inline: 12px; gap: 16px; }
}
@media (max-width: 359px) {
  .services-page :deep(.services-help-card .help-card-button) { font-size: 14px; gap: 10px; }
}
</style>
