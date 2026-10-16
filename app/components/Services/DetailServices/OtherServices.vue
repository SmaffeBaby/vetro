<script setup lang="ts">
import { sortServiceCards } from '#shared/utils/services'
const props = defineProps<{ currentServiceId: string }>()
const { data: services } = await useServices()
const cards = computed(() => sortServiceCards(services.value.cards).filter(card => card.id !== props.currentServiceId))
</script>
<template>
 <section v-if="cards.length" aria-labelledby="other-services-title" class="other-services mx-auto min-w-0 max-w-480 px-5 pb-16 text-[#203e63] tablet:px-8 tablet:pb-24 desktop:px-[4.95%]">
  <SharedCardSlider :key="currentServiceId" :items="cards" title="Другие услуги" region-id="other-services-title" previous-label="Предыдущие услуги" next-label="Следующие услуги"><template #default="{item}"><ServicesCard :card="item" heading-tag="h3" /></template></SharedCardSlider>
 </section>
</template>
