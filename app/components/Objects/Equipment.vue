<script setup lang="ts">
import type {ObjectEquipmentSettings} from '#shared/types/object-equipment'
import {createDefaultObjectEquipment} from '#shared/config/default-object-equipment'
const props=defineProps<{objectId:string}>()
const {data:equipment}=await useSiteQuery<ObjectEquipmentSettings>(() => `/api/object-equipment/${encodeURIComponent(props.objectId)}`,{default:()=>createDefaultObjectEquipment(props.objectId)})
</script>
<template>
 <section v-if="equipment.enabled" aria-labelledby="object-equipment-title" class="object-equipment bg-site-surface py-14 text-site-ink tablet:py-24">
  <div class="mx-auto max-w-480 px-5 tablet:px-8 desktop:px-[min(4.95%,95.04px)]">
   <h2 id="object-equipment-title" class="whitespace-pre-line text-[32px] font-bold leading-[1.1] [overflow-wrap:anywhere] tablet:text-[40px] desktop:text-[clamp(40px,2.9167vw,56px)]">{{equipment.title}}</h2>
   <div v-if="equipment.rows.length" role="region" aria-label="Таблица оборудования" tabindex="0" class="mt-10 overflow-x-auto rounded-[20px] border border-site-line focus-visible:outline-2 focus-visible:outline-site-brand tablet:mt-16">
    <table class="w-full table-fixed border-collapse text-left text-sm leading-[1.4] text-[#333] tablet:text-base" :style="{minWidth:equipment.columns.length>2?`${equipment.columns.length*180}px`:'100%'}">
     <caption class="sr-only">{{equipment.title}}</caption>
     <thead><tr><th v-for="column in equipment.columns" :key="column.id" scope="col" class="border-b border-r border-site-line px-4 py-5 font-bold last:border-r-0 tablet:px-5">{{column.title}}</th></tr></thead>
     <tbody><tr v-for="row in equipment.rows" :key="row.id" class="border-b border-site-line last:border-b-0"><td v-for="(cell,index) in row.cells" :key="equipment.columns[index]?.id" class="whitespace-pre-line break-words border-r border-site-line px-4 py-5 align-top last:border-r-0 [overflow-wrap:anywhere] tablet:px-5">{{cell}}</td></tr></tbody>
    </table>
   </div>
   <p v-if="equipment.description" class="mt-8 max-w-[1200px] whitespace-pre-line text-lg leading-[1.4] [overflow-wrap:anywhere] tablet:mt-10 tablet:text-2xl">{{equipment.description}}</p>
  </div>
 </section>
</template>
