<script setup lang="ts">
import { sortServiceCards } from '#shared/utils/services'
const props = defineProps<{ currentServiceId: string }>()
const { data: services } = await useServices()
const cards = computed(() => sortServiceCards(services.value.cards).filter(card => card.id !== props.currentServiceId))
const carousel = useTemplateRef('carousel')
const canScrollPrev = ref(false)
const canScrollNext = ref(false)
function updateControls() {
  canScrollPrev.value = carousel.value?.emblaApi?.canScrollPrev() ?? false
  canScrollNext.value = carousel.value?.emblaApi?.canScrollNext() ?? false
}
function scrollPrev() { if (canScrollPrev.value) carousel.value?.emblaApi?.scrollPrev() }
function scrollNext() { if (canScrollNext.value) carousel.value?.emblaApi?.scrollNext() }
watch(() => carousel.value?.emblaApi, updateControls, { flush: 'post' })
</script>

<template>
  <section v-if="cards.length" aria-labelledby="other-services-title" class="other-services mx-auto min-w-0 max-w-480 px-5 pb-16 text-[#203e63] tablet:px-8 tablet:pb-24 desktop:px-[4.95%]">
    <div class="flex items-center justify-between gap-4">
      <h2 id="other-services-title" class="min-w-0 text-[32px] font-bold leading-[1.1] tablet:text-[40px] desktop:text-[clamp(40px,2.9167vw,56px)]">Другие услуги</h2>
      <div v-if="cards.length > 1" class="flex shrink-0 items-center gap-3">
        <button type="button" aria-label="Предыдущие услуги" class="carousel-arrow" :disabled="!canScrollPrev" @click="scrollPrev"><span class="carousel-arrow-icon carousel-arrow-left" aria-hidden="true" /></button>
        <button type="button" aria-label="Следующие услуги" class="carousel-arrow" :disabled="!canScrollNext" @click="scrollNext"><span class="carousel-arrow-icon carousel-arrow-right" aria-hidden="true" /></button>
      </div>
    </div>
    <UCarousel
      ref="carousel"
      :key="currentServiceId"
      :items="cards"
      align="start"
      :loop="false"
      @select="updateControls"
      aria-label="Другие услуги"
      class="mt-10 rounded-[32px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf] tablet:mt-14"
      :ui="{
        viewport: 'cursor-grab active:cursor-grabbing',
        container: 'items-stretch -ms-5',
        item: 'basis-[88%] ps-5 tablet:basis-[47%] desktop:basis-[31%]'
      }"
    >
      <template #default="{ item }"><ServicesCard :card="item" heading-tag="h3" /></template>
    </UCarousel>
  </section>
</template>

<style scoped>
.carousel-arrow { display: flex; width: 40px; height: 40px; flex-shrink: 0; align-items: center; justify-content: center; color: #1d395b; transition: color 180ms ease; }
.carousel-arrow:hover:not(:disabled) { color: #2a9ccf; }
.carousel-arrow:disabled { color: #b4bdc9; cursor: default; }
.carousel-arrow:focus-visible { outline: 2px solid #2a9ccf; outline-offset: 4px; border-radius: 4px; }
.carousel-arrow-icon { display: block; width: 40px; height: 40px; background-color: currentColor; mask: var(--arrow-image) center / contain no-repeat; }
.carousel-arrow-left { --arrow-image: url('/images/services/arrow-left.svg'); }
.carousel-arrow-right { --arrow-image: url('/images/services/arrow-right.svg'); }
@media (prefers-reduced-motion: reduce) { .carousel-arrow { transition: none; } }
</style>
