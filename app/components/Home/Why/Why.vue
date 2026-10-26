<script setup lang="ts">
import { sortWhyCards } from '#shared/utils/why.ts'
const { data: why } = await useWhy()
const cards = computed(() => sortWhyCards(why.value.cards))
</script>

<template>
  <section v-if="cards.length" id="why" aria-labelledby="why-title" class="site-why mx-auto max-w-480 px-5 pb-16 text-site-ink tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pb-32">
    <SectionTitle id="why-title" text="Почему мы?" />
    <WhyCards :cards="cards" class="mt-10 tablet:mt-12" />
  </section>
</template>

<style scoped>
.site-why { font-family: Montserrat, sans-serif; }
@media (max-width: 767px) {
  .site-why { padding-inline: 10px; padding-bottom: 56px; }
  .site-why :deep(h2) { font-size: 32px; }
}
@media (max-width: 1199px) { .site-why :deep([role="group"]) { margin-top: 8px; } }
</style>
