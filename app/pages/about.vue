<script setup lang="ts">
import type { AboutHeroSettings } from '#shared/types/about-hero'
import { defaultAboutHero } from '#shared/config/default-about-hero'
const { data: content } = await useFetch<AboutHeroSettings>('/api/about-hero', { key: 'site-about-hero', default: () => structuredClone(defaultAboutHero) })
useHead({ title: () => `${content.value.title} · Ветро`, meta: [{ name: 'description', content: () => content.value.text }] })
</script>

<template>
  <div class="about-page min-h-screen bg-white text-[#203e63]">
    <Header @request="navigateTo('/contacts#write-us')" />
    <main class="mx-auto max-w-480 px-5 pb-16 pt-6 tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pt-10">
      <AboutHero :content="content" />
      <AboutHistory />
      <ServicesTeamSlider embedded title="Наша команда" description="Профессионалы высокого уровня для решения задач любой сложности." region-id="about-team-title" class="mt-16 tablet:mt-24 desktop:mt-40" />
      <AboutLetters />
    </main>
    <Footer @request="navigateTo('/contacts#write-us')" />
  </div>
</template>

<style scoped>
.about-page { font-family: Montserrat, sans-serif; }
</style>
