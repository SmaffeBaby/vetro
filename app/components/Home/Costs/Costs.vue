<script setup lang="ts">
import type { CostSelection } from '#shared/types/costs.ts'
import { selectedCostValues } from '#shared/utils/costs.ts'
const { data: costs } = await useCosts()
const { data: contacts } = await useContacts()
const values = reactive<Record<string, string>>({})
const selected = ref<CostSelection[]>([])
const open = ref(false)
const emit = defineEmits<{ request: [values: CostSelection[]] }>()
const emailHref = computed(() => {
  const item = contacts.value.items.find(item => item.id === 'email')
  if (item?.mode !== 'link' || !item.href.toLowerCase().startsWith('mailto:')) return undefined
  const address = item.href.slice(7).split('?')[0]
  const body = selected.value.map(item => `${item.label}: ${item.value}`).join('\n')
  return `mailto:${address}?subject=${encodeURIComponent('Запрос расчёта обслуживания')}&body=${encodeURIComponent(body)}`
})
function submit() {
  const result = selectedCostValues(costs.value.fields, values)
  if (!result) return
  selected.value = result; open.value = true; emit('request', result)
}
watch(() => costs.value.fields, fields => {
  for (const id of Object.keys(values)) if (!fields.some(field => field.id === id)) delete values[id]
  for (const field of fields) if (!field.options.includes(values[field.id] || '')) values[field.id] = ''
}, { deep: true, immediate: true })
</script>

<template>
  <section id="costs" aria-labelledby="costs-title" class="site-costs min-w-0 rounded-[20px] bg-linear-to-r from-site-brand to-site-brand-light p-6 text-white tablet:p-10 desktop:p-12">
    <h2 id="costs-title" class="text-[28px] font-bold leading-none tablet:text-[32px]">Рассчитать<br>стоимость обслуживания</h2>
    <form class="mt-10 tablet:mt-15" @submit.prevent="submit">
      <div class="grid gap-x-6 gap-y-8 tablet:grid-cols-2 tablet:gap-y-10">
        <div v-for="field in costs.fields" :key="field.id" class="min-w-0"><label :for="`cost-${field.id}`" class="mb-2 block text-sm leading-normal [overflow-wrap:anywhere]">{{ field.label }}</label><select :id="`cost-${field.id}`" v-model="values[field.id]" :name="field.id" required class="block min-h-14 w-full min-w-0 rounded-lg border border-white/60 bg-white/10 px-4 py-3 text-sm text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-white"><option value="" disabled>Выберите вариант</option><option v-for="option in field.options" :key="option" :value="option" class="bg-white text-site-charcoal">{{ option }}</option></select></div>
      </div>
      <button type="submit" class="mt-10 flex min-h-14 w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-base font-semibold text-site-brand transition-colors hover:bg-site-brand-tint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white [overflow-wrap:anywhere]">{{ costs.buttonLabel }}</button>
    </form>
    <UModal v-model:open="open" title="Запрос расчёта" description="Проверьте выбранные параметры и свяжитесь с нами для уточнения стоимости.">
      <template #body><dl class="space-y-4"><div v-for="item in selected" :key="item.id"><dt class="text-sm text-site-muted">{{ item.label }}</dt><dd class="mt-1 font-medium [overflow-wrap:anywhere]">{{ item.value }}</dd></div></dl></template>
      <template #footer><div class="flex flex-wrap gap-3"><UButton v-if="emailHref" :to="emailHref" label="Отправить по email" icon="i-lucide-mail" /><UButton to="/#contacts" label="Связаться с нами" color="neutral" variant="outline" @click="open = false" /></div></template>
    </UModal>
  </section>
</template>

<style scoped>
.site-costs { font-family: Montserrat, sans-serif; }
</style>
