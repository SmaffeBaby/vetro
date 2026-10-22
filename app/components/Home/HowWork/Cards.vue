<script setup lang="ts">
import type { WorkCard } from '#shared/types/how-work.ts'
const props = defineProps<{ cards: WorkCard[] }>()
const activeId = ref<string | null>(null)
const { canCollapse } = useHoverDisclosure()
watch(() => props.cards.map(card => card.id), ids => {
  if (!activeId.value || !ids.includes(activeId.value)) activeId.value = ids[0] ?? null
}, { immediate: true })
const rows = computed(() => {
  const result: WorkCard[][] = []
  for (let index = 0; index < props.cards.length; index += 5) result.push(props.cards.slice(index, index + 5))
  return result
})
</script>

<template>
  <div role="group" aria-label="Этапы работы" class="grid min-w-0 gap-8">
    <ol v-for="(row, index) in rows" :key="index" :aria-label="`Этапы ${index * 5 + 1}–${index * 5 + row.length}`" :start="index * 5 + 1" class="flex min-w-0 flex-col rounded-xl border-2 border-site-line desktop:flex-row"><HowWorkCard v-for="(card, cardIndex) in row" :key="card.id" :card="card" :number="index * 5 + cardIndex + 1" :active="!canCollapse || card.id === activeId" :interactive="canCollapse" @select="activeId = card.id" /></ol>
  </div>
</template>
