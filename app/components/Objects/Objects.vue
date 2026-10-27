<script setup lang="ts">
import type { ObjectsCatalog } from '#shared/types/objects'
const {data:catalog,error}=await useFetch<ObjectsCatalog>('/api/objects',{key:'site-objects'})
const category=ref('all')
const pageSize = 7
const results = ref<HTMLElement | null>(null)
const cards=computed(()=>catalog.value?.objects.filter(o=>category.value==='all'||o.categoryId===category.value)||[])
const { page, total, visibleItems, showPagination, selectPage, loadMore } = usePagedItems(() => cards.value, pageSize)
async function changePage(value: number) {
  selectPage(value)
  await nextTick()
  results.value?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  results.value?.focus({ preventScroll: true })
}
</script>
<template>
 <div class="objects-page min-h-screen bg-site-surface text-site-ink">
  <Header @request="navigateTo('/#contacts')" />
  <main class="mx-auto max-w-480 px-5 pb-16 pt-6 tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pt-10">
   <SharedBreadcrumbs :items="[{label:'Главная',to:'/'},{label:'Объекты'}]" />
   <template v-if="catalog">
    <h1 id="objects-catalog-title" class="mt-8 text-[36px] font-bold leading-[1.12] tablet:text-5xl desktop:text-[60px]">{{ catalog.settings.title }}</h1>
    <div class="objects-filters mt-8 flex flex-wrap gap-2" role="group" aria-label="Категории объектов"><button v-for="item in [{id:'all',label:'Все'},...catalog.settings.categories]" :key="item.id" type="button" :aria-pressed="category===item.id" class="rounded-lg border border-site-brand px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-brand tablet:text-base" :class="category===item.id?'bg-site-brand text-white':'text-site-charcoal hover:bg-site-brand hover:text-white focus-visible:bg-site-brand focus-visible:text-white'" @click="category=item.id">{{ item.label }}</button></div>
    <div v-if="cards.length" ref="results" tabindex="-1" role="region" aria-labelledby="objects-catalog-title" class="objects-results mt-8 scroll-mt-28 outline-none">
      <ObjectsGrid :objects="visibleItems" :button-label="catalog.settings.buttonLabel" />
      <p role="status" aria-live="polite" class="sr-only">Показано {{ visibleItems.length }} из {{ total }} объектов. Страница {{ page }}.</p>
      <SharedPagination v-if="showPagination" :visible-count="visibleItems.length" :page="page" :total="total" :page-size="pageSize" class="mt-10" @update:page="changePage" @more="loadMore" />
    </div>
    <p v-else class="py-16 text-lg" role="status">В этой категории пока нет объектов.</p>
   </template>
   <p v-if="error" class="py-16" role="alert">Не удалось загрузить объекты. Обновите страницу.</p>
   <ObjectsNextObject class="mt-16 hidden tablet:mt-24 tablet:block" @request="navigateTo('/#contacts')" />
  </main>
  <Footer @request="navigateTo('/#contacts')" />
 </div>
</template>
<style scoped>
.objects-page :deep(.site-header),.objects-page :deep(#header-navigation){background-color:var(--color-site-surface)}
.objects-page { font-family: Montserrat, sans-serif; }
@media (max-width: 767px) {
  .objects-page main { padding: 16px 10px 60px; }
  .objects-page main > nav { display: none; }
  .objects-page h1 { margin-top: 0; font-size: 32px; }
  .objects-filters { flex-wrap: nowrap; overflow-x: auto; margin: 20px -10px 0; padding-inline: 10px; padding-bottom: 2px; gap: 10px; scrollbar-width: none; }
  .objects-filters::-webkit-scrollbar { display: none; }
  .objects-filters button { flex-shrink: 0; min-height: 44px; border-width: 2px; border-radius: 10px; font-size: 16px; }
  .objects-results { margin-top: 20px; }
  .objects-results > .grid { gap: 10px; }
  .objects-page :deep(.object-card) { padding: 20px; border-radius: 40px; }
  .objects-page :deep(.object-card img), .objects-page :deep(.object-card a > div) { aspect-ratio: 1.05; }
  .objects-page :deep(.object-card-title) { margin-top: 30px; font-size: 20px; }
  .objects-page :deep(.object-card > div:last-child) { padding-top: 96px; }
  .objects-page :deep(.object-card .site-outline-button) { min-height: 48px; padding-block: 12px; border-radius: 20px; font-size: 16px; }
}
</style>
