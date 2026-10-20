<script setup lang="ts">
import type {ServiceCard} from '#shared/types/services'
import {sortServiceCards} from '#shared/utils/services'
const props=defineProps<{cards:ServiceCard[]}>()
const sortedCards=computed(()=>sortServiceCards(props.cards))
</script>
<template>
 <section v-if="sortedCards.length" aria-labelledby="object-services-title" class="overflow-hidden bg-[#f8f9fa] py-14 text-[#203e63] tablet:py-24">
  <div class="mx-auto min-w-0 max-w-480 px-5 tablet:px-8 desktop:px-[min(4.95%,95.04px)]">
   <SharedCardSlider :items="sortedCards" title="Выполняемые услуги на объекте" region-id="object-services-title" previous-label="Предыдущие услуги на объекте" next-label="Следующие услуги на объекте">
    <template #default="{item}"><ServicesCard :card="item" heading-tag="h3" /></template>
   </SharedCardSlider>
  </div>
 </section>
</template>
