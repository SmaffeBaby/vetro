<script setup lang="ts" generic="T extends { id: string }">
defineSlots<{ default(props: { item: T }): unknown }>()
const props = withDefaults(defineProps<{ items: T[]; title: string; description?: string; regionId: string; itemClass?: string; carouselClass?: string; previousLabel?: string; nextLabel?: string }>(), { description: '', itemClass: 'basis-[88%] ps-5 tablet:basis-[47%] desktop:basis-[31%]', carouselClass: 'mt-10 rounded-[32px] tablet:mt-14', previousLabel: 'Предыдущие карточки', nextLabel: 'Следующие карточки' })
const carousel = useTemplateRef('carousel')
const canScrollPrev = ref(false), canScrollNext = ref(false)
function updateControls() { canScrollPrev.value = carousel.value?.emblaApi?.canScrollPrev() ?? false; canScrollNext.value = carousel.value?.emblaApi?.canScrollNext() ?? false }
function scrollPrev() { if (canScrollPrev.value) carousel.value?.emblaApi?.scrollPrev() }
function scrollNext() { if (canScrollNext.value) carousel.value?.emblaApi?.scrollNext() }
watch(() => carousel.value?.emblaApi, (api, old) => {
 old?.off('reInit',updateControls); api?.on('reInit',updateControls); updateControls()
}, { flush: 'post' })
onBeforeUnmount(() => carousel.value?.emblaApi?.off('reInit',updateControls))
</script>
<template>
 <div>
  <div class="flex items-start justify-between gap-4">
   <div class="min-w-0"><h2 :id="regionId" class="whitespace-pre-line break-words text-[32px] font-bold leading-[1.1] tablet:text-[40px] desktop:text-[clamp(40px,2.9167vw,56px)]">{{ title }}</h2><p v-if="description" class="mt-5 max-w-[1200px] whitespace-pre-line text-lg leading-[1.4] tablet:text-2xl">{{ description }}</p></div>
   <div v-if="items.length > 1" class="flex shrink-0 items-center gap-3">
    <button type="button" :aria-label="previousLabel" class="carousel-arrow" :disabled="!canScrollPrev" @click="scrollPrev"><span class="carousel-arrow-icon carousel-arrow-left" aria-hidden="true" /></button>
    <button type="button" :aria-label="nextLabel" class="carousel-arrow" :disabled="!canScrollNext" @click="scrollNext"><span class="carousel-arrow-icon carousel-arrow-right" aria-hidden="true" /></button>
   </div>
  </div>
  <UCarousel ref="carousel" :items="props.items" align="start" :loop="false" @select="updateControls" :aria-label="title" class="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-brand" :class="carouselClass" :ui="{viewport:'cursor-grab active:cursor-grabbing',container:'items-stretch -ms-5',item:itemClass}">
   <template #default="{ item }"><slot :item="item as T" /></template>
  </UCarousel>
 </div>
</template>
<style scoped>
.carousel-arrow { display: flex; width: 40px; height: 40px; flex-shrink: 0; align-items: center; justify-content: center; color: var(--color-site-ink); transition: color 180ms ease; }
.carousel-arrow:hover:not(:disabled) { color: var(--color-site-brand); }
.carousel-arrow:disabled { color: var(--color-site-disabled); cursor: default; }
.carousel-arrow:focus-visible { outline: 2px solid var(--color-site-brand); outline-offset: 4px; border-radius: 4px; }
.carousel-arrow-icon { display: block; width: 40px; height: 40px; background-color: currentColor; mask: var(--arrow-image) center / contain no-repeat; }
.carousel-arrow-left { --arrow-image: url('/images/services/arrow-left.svg'); }
.carousel-arrow-right { --arrow-image: url('/images/services/arrow-right.svg'); }
@media (prefers-reduced-motion: reduce) { .carousel-arrow { transition: none; } }
</style>
