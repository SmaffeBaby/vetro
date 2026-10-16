<script setup lang="ts">
import { sortWorkCards } from '#shared/utils/how-work.ts'
const { data: work } = await useHowWork()
const cards = computed(() => sortWorkCards(work.value.cards))
</script>

<template>
  <section v-if="cards.length" id="how-work" aria-labelledby="how-work-title" class="site-how-work mx-auto max-w-480 px-5 pb-16 text-[#203e63] tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pb-32">
    <SectionTitle id="how-work-title" text="Как мы работаем?" />
    <HowWorkCards :cards="cards" class="mt-10 tablet:mt-12" />
  </section>
</template>

<style scoped>
.site-how-work { font-family: Montserrat, sans-serif; }
</style>
