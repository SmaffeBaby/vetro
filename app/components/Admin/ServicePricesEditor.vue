<script setup lang="ts">
const { data: services, error: servicesError, refresh: reloadServices } = await useServices()
const { options, selectedId, previewHref, selectService, form, loading, saving, loaded, error, notice, isDirty, updatedLabel, save, load, discard, addRow, removeRow, moveRow } = useAdminServicePrices(() => servicesError.value ? [] : services.value.cards)
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold">Стоимость услуг</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликован' }}</UBadge></div><p class="text-sm text-slate-500">Стоимость работ на детальной странице. Поля и строки прайса сохраняются независимо для каждой услуги.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <UAlert v-if="servicesError" class="mb-6" color="error" variant="soft" description="Не удалось загрузить список услуг."><template #actions><UButton label="Повторить" @click="reloadServices()" /></template></UAlert>
    <div class="mb-6 flex flex-wrap items-end gap-4"><UFormField label="Услуга" class="min-w-0 flex-1"><USelect :model-value="selectedId" :items="options" :disabled="saving || !options.length" aria-label="Выбрать услугу" class="w-full" @update:model-value="selectService($event)" /></UFormField><UButton :to="previewHref" target="_blank" label="Открыть страницу услуги" icon="i-lucide-external-link" color="neutral" variant="outline" /></div>
    <p v-if="!options.length && !servicesError" class="mb-6 text-sm text-slate-500">Сначала добавьте услугу в разделе Services → Услуги.</p>
    <USkeleton v-if="loading" class="h-80 w-full" />
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" @submit.prevent="save"><fieldset :disabled="saving" class="space-y-6">
        <UCard><template #header><h2 class="font-semibold">Заголовок, описание и кнопка</h2></template><div class="space-y-5">
          <UFormField label="Заголовок"><UTextarea v-model="form.title" aria-label="Заголовок стоимости услуг" :rows="2" maxlength="240" class="w-full" /></UFormField>
          <UFormField label="Описание"><UTextarea v-model="form.description" aria-label="Описание стоимости услуг" :rows="4" maxlength="4000" class="w-full" /></UFormField>
          <UFormField label="Название кнопки" description="Кнопка ведёт к контактам на главной странице."><UInput v-model="form.buttonLabel" aria-label="Название кнопки прайс-листа" maxlength="80" class="w-full" /></UFormField>
        </div></UCard>
        <h2 class="text-lg font-semibold">Прайс-лист ({{ form.rows.length }} / 50)</h2>
        <UCard v-for="(row, index) in form.rows" :key="row.id">
          <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h3 class="font-semibold">Строка {{ index + 1 }}</h3><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять строку ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveRow(index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить строку ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.rows.length - 1" @click="moveRow(index, 1)" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить строку ${index + 1}`" color="error" variant="ghost" @click="removeRow(index)" /></div></div></template>
          <div class="grid gap-5 tablet:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)]"><UFormField label="Название"><UTextarea v-model="row.name" :aria-label="`Название работы ${index + 1}`" :rows="2" maxlength="300" class="w-full" /></UFormField><UFormField label="Текст с ценой" description="Например: от 25 000 ₽ или По запросу."><UTextarea v-model="row.price" :aria-label="`Текст с ценой ${index + 1}`" :rows="2" maxlength="160" class="w-full" /></UFormField></div>
        </UCard>
        <p v-if="!form.rows.length" class="text-sm text-slate-500">Строк пока нет. Добавьте работы и цены для выбранной услуги.</p>
        <UButton label="Добавить строку прайса" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.rows.length >= 50" @click="addRow" />
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
      </fieldset></form>
    </div>
  </div>
</template>
