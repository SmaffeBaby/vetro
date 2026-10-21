<script setup lang="ts">
import type { AboutHeroSettings } from '#shared/types/about-hero'
defineProps<{ content: AboutHeroSettings }>()
</script>

<template>
  <section aria-labelledby="about-title">
    <SharedBreadcrumbs :items="[{ label: 'Главная', to: '/' }, { label: content.breadcrumb }]" />
    <h1 id="about-title" class="mt-8 whitespace-pre-line text-[36px] font-bold leading-tight [overflow-wrap:anywhere] tablet:text-5xl desktop:text-[60px]">{{ content.title }}</h1>
    <AboutHeroText :subtitle="content.subtitle" :text="content.text" />
    <AboutHeroImage :path="content.imagePath" :alt="content.imageAlt" />
  </section>
</template>
