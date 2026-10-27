<script setup lang="ts">
import type { AboutHeroSettings } from '#shared/types/about-hero'
import { defaultAboutHero } from '#shared/config/default-about-hero'
const { data: content } = await useFetch<AboutHeroSettings>('/api/about-hero', { key: 'site-about-hero', default: () => structuredClone(defaultAboutHero) })
useHead({ title: () => `${content.value.title} · Ветро`, meta: [{ name: 'description', content: () => content.value.text }] })
</script>

<template>
  <div class="about-page min-h-screen bg-white text-site-ink">
    <Header @request="navigateTo('/contacts#write-us')" />
    <main class="mx-auto max-w-480 px-5 pb-16 pt-6 tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pt-10">
      <AboutHero :content="content" />
      <AboutHistory />
      <ServicesTeamSlider embedded region-id="about-team-title" class="mt-16 tablet:mt-24 desktop:mt-40" />
      <AboutLetters />
      <AboutProject />
    </main>
    <Footer @request="navigateTo('/contacts#write-us')" />
  </div>
</template>

<style scoped>
.about-page { font-family: Montserrat, sans-serif; }
@media (max-width: 767px) {
  .about-page main { padding: 16px 10px 60px; }
  .about-page :deep(.about-hero nav) { display: none; }
  .about-page :deep(#about-title) { margin-top: 0; font-size: 32px; }
  .about-page :deep(.about-hero-text) { margin-top: 24px; gap: 24px; }
  .about-page :deep(.about-hero-text h2) { font-size: 24px; }
  .about-page :deep(.about-hero-text > div) { font-size: 18px; font-weight: 600; line-height: 1.5; }
  .about-page :deep(.about-hero > img) { margin-inline: -10px; width: calc(100% + 20px); max-width: none; border-radius: 20px; }
  .about-page :deep(.about-history) { margin-top: 64px; }
  .about-page :deep(.about-history .slider-item), .about-page :deep(.services-team .slider-item) { flex-basis: 75%; padding-inline-start: 5px; }
  .about-page :deep(.slider-track) { margin-inline-start: -5px; }
  .about-page :deep(.about-history-carousel) { margin-top: 48px; }
  .about-page :deep(.about-history h3) { font-size: 60px; }
  .about-page :deep(.about-history article > p) { margin-top: 16px; font-size: 16px; }
  .about-page :deep(.about-history article > div) { padding-top: 40px; }
  .about-page :deep(.services-team) { margin-top: 96px; }
  .about-page :deep(.services-team h2 + p) { font-weight: 600; }
  .about-page :deep(.services-team article > div) { border-radius: 20px; }
  .about-page :deep(.about-letters) { margin-top: 64px; }
  .about-page :deep(#about-letters-title) { line-height: 1.1; }
  .about-page :deep(.about-letters > .grid) { margin-top: 24px; gap: 10px; }
  .about-page :deep(.about-letter) { padding: 30px; border-radius: 40px; }
  .about-page :deep(.about-letter > div) { flex-direction: column; gap: 20px; }
  .about-page :deep(.about-letter > div > span) { padding-block: 10px; font-size: 16px; }
  .about-page :deep(.about-letter h3) { font-size: 24px; }
  .about-page :deep(.about-letter blockquote > p) { line-height: 1.4; }
  .about-page :deep(.about-letter blockquote > footer) { padding-top: 48px; }
  .about-page :deep(.about-project) { margin-inline: -10px; min-height: 450px; border-radius: 40px; padding: 80px 10px; }
  .about-page :deep(.about-project h2 + p) { margin-top: 32px; font-size: 16px; line-height: 1.35; }
  .about-page :deep(.about-project .help-card-button) { width: 100%; min-height: 48px; margin-top: 24px; padding-block: 12px; }
}
</style>
