<script setup lang="ts">
import type {SiteObject,ObjectsCatalog} from '#shared/types/objects'
import {mediaUrl} from '#shared/utils/media'
const props=defineProps<{object:SiteObject}>()
const {data:catalog}=await useFetch<ObjectsCatalog>('/api/objects',{key:'site-objects'})
const {data:services}=await useServices()
const category=computed(()=>catalog.value?.settings.categories.find(c=>c.id===props.object.categoryId)?.label||'')
const activeServices=computed(()=>services.value.cards.filter(c=>props.object.serviceIds.includes(c.id)))
</script>
<template>
 <div class="min-h-screen bg-white text-[#203e63]">
  <Header @request="navigateTo('/#contacts')" />
  <main class="pb-16 pt-6 tablet:pb-24 desktop:pt-10">
   <div class="mx-auto max-w-480 px-5 tablet:px-8 desktop:px-[min(4.95%,95.04px)]">
   <SharedBreadcrumbs :items="[{label:'Главная',to:'/'},{label:'Объекты',to:'/objects'},{label:object.title}]" />
   <div class="mt-8 grid items-start gap-10 desktop:grid-cols-[1.08fr_1fr] desktop:gap-16">
    <div class="min-w-0">
     <ObjectsDetailText :title="object.title" :subtitle="object.subtitle" :description="object.description"><template #after-title><img v-if="object.imagePath" :src="mediaUrl(object.imagePath)" :alt="object.title" width="900" height="675" class="mt-6 aspect-[4/3] w-full rounded-[28px] object-cover desktop:hidden" /></template></ObjectsDetailText>
     <ObjectsProperties :category="category" :service-count="activeServices.length" :area="object.area" :since-year="object.sinceYear" class="mt-10 tablet:mt-14" />
    </div>
    <img v-if="object.imagePath" :src="mediaUrl(object.imagePath)" :alt="object.title" width="900" height="675" class="hidden aspect-[4/3] w-full rounded-[40px] object-cover desktop:block" />
   </div>
   </div>
   <ObjectsServices :cards="activeServices" class="mt-16 tablet:mt-24" />
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
