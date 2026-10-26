<script setup lang="ts">
import type { SkillCard } from '#shared/types/skills.ts'
const props = defineProps<{ cards: SkillCard[] }>()
const rows = useSkillRows(() => props.cards)
const { activeId, hovered, focused, focusCard } = useSkillDisclosure(() => props.cards)
</script>

<template>
  <div role="list" aria-label="Компетенции компании" class="skills-cards grid min-w-0 grid-cols-1 gap-5 tablet:grid-cols-2 desktop:flex desktop:flex-col desktop:gap-8">
    <div v-for="(row, index) in rows" :key="index" class="contents desktop:flex desktop:gap-[clamp(16px,1.6667vw,32px)]">
      <SkillsCard v-for="card in row" :key="card.id" :card="card" :active="card.id === activeId"
        @mouseenter="hovered = card.id" @mouseleave="hovered = null"
        @focus="focusCard(card.id, $event)" @blur="focused = null" />
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 767px) {
  .skills-cards { display: flex; gap: 10px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: 10px; margin-inline: -10px; padding-inline: 10px; scrollbar-width: none; }
  .skills-cards::-webkit-scrollbar { display: none; }
  .skills-cards :deep(.skill-card) { flex: 0 0 82%; min-height: 330px; padding: 20px 18px; scroll-snap-align: start; }
}
</style>
