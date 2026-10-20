<script setup lang="ts">
import type { ObjectsCatalog } from '#shared/types/objects'
const {data:catalog,error}=await useFetch<ObjectsCatalog>('/api/objects',{key:'site-objects'})
const category=ref('all')
const cards=computed(()=>catalog.value?.objects.filter(o=>category.value==='all'||o.categoryId===category.value)||[])
</script>
<template>
 <div class="objects-page min-h-screen bg-[#f7f8fa] text-[#203e63]">
  <Header @request="navigateTo('/#contacts')" />
  <main class="mx-auto max-w-480 px-5 pb-16 pt-6 tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pt-10">
   <SharedBreadcrumbs :items="[{label:'Главная',to:'/'},{label:'Объекты'}]" />
   <template v-if="catalog">
    <h1 class="mt-8 text-[36px] font-bold leading-[1.12] tablet:text-5xl desktop:text-[60px]">{{ catalog.settings.title }}</h1>
    <div class="mt-8 flex flex-wrap gap-2" role="group" aria-label="Категории объектов"><button v-for="item in [{id:'all',label:'Все'},...catalog.settings.categories]" :key="item.id" type="button" :aria-pressed="category===item.id" class="rounded-lg border border-[#2a9ccf] px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf] tablet:text-base" :class="category===item.id?'bg-[#2a9ccf] text-white':'text-[#203e63] hover:bg-[#eaf6fc]'" @click="category=item.id">{{ item.label }}</button></div>
    <div v-if="cards.length" class="mt-8 grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3"><ObjectsCard v-for="card in cards" :key="card.id" :object="card" :button-label="catalog.settings.buttonLabel" /></div>
    <p v-else class="py-16 text-lg" role="status">В этой категории пока нет объектов.</p>
   </template>
   <p v-if="error" class="py-16" role="alert">Не удалось загрузить объекты. Обновите страницу.</p>
  </main>
  <Footer @request="navigateTo('/#contacts')" />
 </div>
</template>
<style scoped>
.objects-page :deep(.site-header),.objects-page :deep(#header-navigation){background-color:#f7f8fa}
</style>
