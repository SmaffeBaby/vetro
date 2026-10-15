<script setup lang="ts">
import type { FooterEntry } from '#shared/types/footer'
const items = defineModel<FooterEntry[]>({ required: true })
defineProps<{ label: string }>()
function add() {
  if (items.value.length < 20) items.value.push({ id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, mode: 'text', text: '', href: '', code: '', highlight: '' })
}
function move(index: number, delta: number) {
  const target = index + delta
  if (target < 0 || target >= items.value.length) return
  const item = items.value.splice(index, 1)[0]!
  items.value.splice(target, 0, item)
}
</script>

<template>
  <div class="space-y-4">
    <div v-for="(item, index) in items" :key="item.id" class="space-y-4 rounded-lg border border-slate-200 bg-slate-50/40 p-4">
      <div class="flex flex-wrap items-center justify-between gap-2"><h3 class="text-sm font-medium">{{ label }} · {{ index + 1 }}</h3><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять ${label} ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="move(index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить ${label} ${index + 1}`" color="neutral" variant="ghost" :disabled="index === items.length - 1" @click="move(index, 1)" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить ${label} ${index + 1}`" color="error" variant="ghost" @click="items.splice(index, 1)" /></div></div>
      <AdminFooterEntryFields :item="item" :label="`${label} ${index + 1}`" />
    </div>
    <p v-if="!items.length" class="text-sm text-slate-500">Пунктов пока нет.</p>
    <UButton label="Добавить текст" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="items.length >= 20" @click="add" />
  </div>
</template>
