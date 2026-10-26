<script setup lang="ts">
import type { ObjectsCatalog } from '#shared/types/objects'

const { data: catalog } = await useFetch<ObjectsCatalog>('/api/objects', { key: 'site-objects' })
const objects = computed(() => catalog.value?.objects.slice(0, 3) || [])
</script>

<template>
  <section v-if="objects.length" id="home-objects" aria-labelledby="home-objects-title" class="home-objects mx-auto max-w-480 px-5 pb-16 text-site-ink tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pb-32">
    <h2 id="home-objects-title" class="text-[28px] font-bold leading-tight tablet:text-[32px] desktop:text-[clamp(26px,1.6667vw,32px)]">{{ catalog?.settings.title }}</h2>
    <div class="mt-8 grid grid-cols-1 gap-5 tablet:mt-10 tablet:grid-cols-3 desktop:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,0.54fr)]">
      <ObjectsCard v-for="object in objects" :key="object.id" :object="object" :button-label="catalog?.settings.buttonLabel" variant="home" heading-tag="h3" />
      <NuxtLink to="/objects" class="home-objects-all flex min-h-20 items-center justify-center rounded-2xl bg-linear-to-br from-site-brand to-site-brand-light px-6 py-6 text-center text-2xl font-bold leading-none text-white transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-brand tablet:col-span-3 desktop:col-span-1 desktop:text-[32px]">
        <span>Все<span class="desktop:block"> объекты</span></span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
@media (max-width: 767px) {
  .home-objects { padding-inline: 10px; padding-bottom: 56px; font-family: Montserrat, sans-serif; }
  .home-objects h2 { font-size: 32px; line-height: 1.1; }
  .home-objects :deep(.object-card) { padding: 14px 20px; }
  .home-objects :deep(.object-card img), .home-objects :deep(.object-card a > div) { aspect-ratio: 1.05; }
  .home-objects :deep(.object-card-title) { margin-top: 30px; font-size: 20px; }
  .home-objects :deep(.object-card .site-outline-button) { border-radius: 20px; padding-block: 12px; font-size: 16px; }
  .home-objects :deep(.object-card > div:last-child) { padding-top: 90px; }
  .home-objects-all { min-height: 300px; font-size: 32px; }
  .home-objects-all span > span { display: block; }
}
</style>
