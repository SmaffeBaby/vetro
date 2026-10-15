<script setup lang="ts">
import type { SkillCard } from '#shared/types/skills'
const props = defineProps<{ cards: SkillCard[] }>()
const rows = useSkillRows(() => props.cards)
const { activeId, hovered, focused, focusCard } = useSkillDisclosure(() => props.cards)
</script>

<template>
  <div role="list" aria-label="Компетенции компании" class="grid min-w-0 grid-cols-1 gap-5 tablet:grid-cols-2 desktop:flex desktop:flex-col desktop:gap-8">
    <div v-for="(row, index) in rows" :key="index" class="contents desktop:flex desktop:gap-[clamp(16px,1.6667vw,32px)]">
      <SkillsCard v-for="card in row" :key="card.id" :card="card" :active="card.id === activeId"
        @mouseenter="hovered = card.id" @mouseleave="hovered = null"
        @focus="focusCard(card.id, $event)" @blur="focused = null" />
    </div>
  </div>
</template>
