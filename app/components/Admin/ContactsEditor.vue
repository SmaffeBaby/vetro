<script setup lang="ts">
const props = withDefaults(defineProps<{ kind?: 'home' | 'page' }>(), { kind: 'home' })
const { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, iconPreview, load, save, uploadSvg, removeSvg, discard } = useAdminContacts(props.kind)
const labels = { phone: 'Телефон', address: 'Адрес', email: 'Email' }
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight">Контакты</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликованы' }}</UBadge></div><p class="text-sm text-slate-500">{{ kind === 'page' ? 'Контакты страницы /contacts, реквизиты, мессенджеры и карта.' : 'Контактный блок на главной странице.' }}</p><UButton v-if="kind === 'page'" to="/contacts" target="_blank" label="Открыть страницу контактов" color="neutral" variant="link" class="mt-2" /></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <div v-if="loading" class="space-y-5"><USkeleton class="h-64 w-full" /><USkeleton class="h-80 w-full" /></div>
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" id="contacts-settings" @submit.prevent="save">
        <fieldset :disabled="saving" class="space-y-6">
          <AdminContactsPageFields v-if="kind === 'page'" :page="form.page" @upload="uploadSvg" @remove="removeSvg" />
          <UCard v-for="item in form.items" :key="item.id">
            <template #header><h2 class="font-semibold">{{ labels[item.id] }}</h2></template>
            <div class="space-y-5">
              <div class="grid gap-5 tablet:grid-cols-[1fr_120px]">
                <UFormField :label="`SVG: ${labels[item.id]}`" description="Код SVG или файл до 200 КБ. Загрузка и удаление применяются после сохранения."><UTextarea v-model="item.svg" :aria-label="`SVG: ${labels[item.id]}`" :rows="4" class="w-full" :ui="{ base: 'font-mono text-xs' }" /></UFormField>
                <div class="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4"><img v-if="item.svg" :src="iconPreview(item)" :alt="`Иконка: ${labels[item.id]}`" class="max-h-16 max-w-full"><span v-else class="text-xs text-slate-400">Нет SVG</span></div>
              </div>
              <div class="flex flex-wrap gap-3"><label class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><UIcon name="i-lucide-upload" class="size-4" />Загрузить SVG<input type="file" accept="image/svg+xml,.svg" :aria-label="`Загрузить SVG: ${labels[item.id]}`" class="sr-only" @change="uploadSvg($event, item)"></label><UButton label="Удалить SVG" icon="i-lucide-trash-2" color="error" variant="outline" :disabled="!item.svg" @click="removeSvg(item)" /></div>
              <UFormField :label="`Подпись: ${labels[item.id]}`"><UInput v-model="item.title" :aria-label="`Подпись: ${labels[item.id]}`" maxlength="120" class="w-full" /></UFormField>
              <AdminFooterEntryFields :item="item" :label="labels[item.id]" :allow-highlight="false" />
            </div>
          </UCard>
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
