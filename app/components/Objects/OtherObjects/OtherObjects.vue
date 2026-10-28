<script setup lang="ts">
import type {ObjectsCatalog} from '#shared/types/objects'
import type {OtherObjectsSettings} from '#shared/types/other-objects'
import {defaultOtherObjects} from '#shared/config/default-other-objects'
const props=defineProps<{currentObjectId:string}>()
const {data:settings}=await useSiteQuery<OtherObjectsSettings>('/api/other-objects',{default:()=>structuredClone(defaultOtherObjects)})
const {data:catalog}=await useSiteQuery<ObjectsCatalog>('/api/objects',{})
const cards=computed(()=>{
 const available=catalog.value?.objects.filter(o=>o.id!==props.currentObjectId)||[]
 return (settings.value.objectIds.length?settings.value.objectIds.flatMap(id=>available.filter(o=>o.id===id)):available).slice(0,3)
})
</script>
<template>
 <section v-if="cards.length" class="other-objects" aria-labelledby="other-objects-title">
  <div class="flex flex-wrap items-center justify-between gap-5">
   <h2 id="other-objects-title" class="min-w-0 whitespace-pre-line text-[32px] font-bold leading-[1.1] [overflow-wrap:anywhere] tablet:text-[40px] desktop:text-[clamp(40px,2.9167vw,56px)]">{{ settings.title }}</h2>
   <NuxtLink to="/objects" class="other-objects-all site-outline-button inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg border border-site-brand px-8 py-3 text-base font-semibold text-site-brand transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-brand">{{ settings.buttonLabel }}</NuxtLink>
  </div>
  <div class="mt-10 grid grid-cols-1 gap-7 tablet:mt-14 tablet:grid-cols-2 desktop:grid-cols-3"><ObjectsCard v-for="card in cards" :key="card.id" :object="card" variant="related" show-mobile-details /></div>
 </section>
</template>
