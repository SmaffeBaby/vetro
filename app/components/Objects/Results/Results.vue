<script setup lang="ts">
import type {ObjectResultsSettings} from '#shared/types/object-results'
import {createDefaultObjectResults} from '#shared/config/default-object-results'
const props=defineProps<{objectId:string}>()
const {data:results}=await useFetch<ObjectResultsSettings>(`/api/object-results/${encodeURIComponent(props.objectId)}`,{key:`site-object-results-${props.objectId}`,default:()=>createDefaultObjectResults(props.objectId)})
</script>
<template>
 <section v-if="results.cards.length" aria-labelledby="object-results-title" class="object-results border-y border-site-line py-14 text-site-ink tablet:py-24 desktop:py-36">
  <div class="mx-auto max-w-480 px-5 tablet:px-8 desktop:px-[min(4.95%,95.04px)]">
  <h2 id="object-results-title" class="whitespace-pre-line text-[32px] font-bold leading-[1.1] [overflow-wrap:anywhere] tablet:text-[40px] desktop:text-[clamp(40px,2.9167vw,56px)]">{{results.title}}</h2>
  <dl class="mt-10 grid grid-cols-1 gap-8 tablet:mt-14 tablet:grid-cols-2 desktop:mt-16 desktop:grid-cols-4 desktop:gap-12"><ObjectsResultsCard v-for="card in results.cards" :key="card.id" :card="card"/></dl>
  </div>
 </section>
</template>
