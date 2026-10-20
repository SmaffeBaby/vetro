<script setup lang="ts">
import type {SiteObject,ObjectsCatalog} from '#shared/types/objects'
import {mediaUrl} from '#shared/utils/media'
import {serviceDetailHref} from '#shared/utils/services-detail'
const props=defineProps<{object:SiteObject}>()
const {data:catalog}=await useFetch<ObjectsCatalog>('/api/objects',{key:'site-objects'})
const {data:services}=await useServices()
const category=computed(()=>catalog.value?.settings.categories.find(c=>c.id===props.object.categoryId)?.label||'')
const activeServices=computed(()=>services.value.cards.filter(c=>props.object.serviceIds.includes(c.id)))
</script>
<template>
 <div class="min-h-screen bg-white text-[#203e63]">
  <Header @request="navigateTo('/#contacts')" />
  <main class="mx-auto max-w-480 px-5 pb-16 pt-6 tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pt-10">
   <SharedBreadcrumbs :items="[{label:'Главная',to:'/'},{label:'Объекты',to:'/objects'},{label:object.title}]" />
   <div class="mt-8 grid items-start gap-10 desktop:grid-cols-[1.08fr_1fr] desktop:gap-16">
    <div class="min-w-0">
     <ObjectsDetailText :title="object.title" :subtitle="object.subtitle" :description="object.description" />
     <ObjectsProperties :category="category" :service-count="activeServices.length" :area="object.area" :since-year="object.sinceYear" class="mt-10 tablet:mt-14" />
     <div v-if="activeServices.length" class="mt-8"><h2 class="text-lg font-semibold">Услуги на объекте</h2><ul class="mt-3 space-y-2"><li v-for="service in activeServices" :key="service.id"><NuxtLink :to="serviceDetailHref(service.id)" class="text-[#2a9ccf] underline decoration-[#2a9ccf]/30 underline-offset-4 hover:decoration-current">{{ service.title }}</NuxtLink></li></ul></div>
    </div>
    <img v-if="object.imagePath" :src="mediaUrl(object.imagePath)" :alt="object.title" width="900" height="675" class="aspect-[4/3] w-full rounded-[32px] object-cover tablet:rounded-[40px]" />
   </div>
   <ObjectsOtherObjects :current-object-id="object.id" class="mt-16 tablet:mt-24" />
   <ObjectsRequestCard class="mt-16 tablet:mt-24" @request="navigateTo('/#contacts')" />
  </main>
  <Footer @request="navigateTo('/#contacts')" />
 </div>
</template>
