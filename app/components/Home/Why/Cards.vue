<script setup lang="ts">
import type { WhyCard } from '#shared/types/why.ts'
const props = defineProps<{ cards: WhyCard[] }>()
const activeId = ref<string | null>(null)
const { canCollapse } = useHoverDisclosure()
watch(() => props.cards.map(card => card.id), ids => {
  if (!activeId.value || !ids.includes(activeId.value)) activeId.value = ids[0] ?? null
}, { immediate: true })
const rows = computed(() => {
  const result: WhyCard[][] = []
  for (let index = 0; index < props.cards.length; index += 5) result.push(props.cards.slice(index, index + 5))
  return result
})
</script>

<template>
  <div role="group" aria-label="Наши преимущества" class="grid min-w-0 gap-8">
    <ul v-for="(row, index) in rows" :key="index" :aria-label="`Преимущества ${index * 5 + 1}–${index * 5 + row.length}`" class="flex min-w-0 flex-col desktop:flex-row"><WhyCard v-for="card in row" :key="card.id" :card="card" :active="!canCollapse || card.id === activeId" :interactive="canCollapse" @select="activeId = card.id" /></ul>
  </div>
</template>
