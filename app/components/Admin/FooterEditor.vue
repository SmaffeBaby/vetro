<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, logoPreview, updatedLabel, load, save, discard, addColumn, removeColumn, arrangeColumns, moveColumn, uploadLogo, removeLogo } = useAdminFooter()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight">Footer</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликован' }}</UBadge></div><p class="text-sm text-slate-500">Логотип, колонки, кнопка и нижняя строка футера.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <div v-if="loading" class="space-y-5"><USkeleton class="h-64 w-full" /><USkeleton class="h-80 w-full" /></div>
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <UAlert color="info" variant="soft" description="Используйте {{year}} в любом тексте или HTML-коде — на сайте автоматически появится текущий год." />
      <form v-if="loaded" id="footer-settings" @submit.prevent="save">
        <fieldset :disabled="saving" class="space-y-6">
          <UCard>
            <template #header><h2 class="font-semibold">Left content · логотип и текст</h2></template>
            <div class="space-y-5">
              <div class="grid gap-5 tablet:grid-cols-[1fr_240px]">
                <UFormField label="Logo SVG" description="Код SVG или файл до 200 КБ."><UTextarea v-model="form.logoSvg" aria-label="Logo SVG футера" :rows="6" class="w-full" :ui="{ base: 'font-mono text-xs' }" /></UFormField>
                <div class="flex min-h-32 items-center justify-center rounded-xl bg-[#203b5c] p-5"><img v-if="form.logoSvg" :src="logoPreview" alt="Предпросмотр логотипа футера" class="max-h-24 max-w-full"><span v-else class="text-sm text-white/60">Нет логотипа</span></div>
              </div>
              <div class="flex flex-wrap gap-3"><label class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><UIcon name="i-lucide-upload" class="size-4" />Загрузить SVG<input type="file" accept="image/svg+xml,.svg" aria-label="Загрузить логотип футера" class="sr-only" @change="uploadLogo"></label><UButton label="Удалить логотип" icon="i-lucide-trash-2" color="error" variant="outline" :disabled="!form.logoSvg" @click="removeLogo" /></div>
              <UFormField label="Текст под логотипом"><UTextarea v-model="form.text" aria-label="Текст под логотипом футера" maxlength="2000" :rows="3" class="w-full" /></UFormField>
            </div>
          </UCard>
          <div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-semibold">Column footer · колонки {{ form.columns.length }} / 8</h2><UButton label="Упорядочить по сортировке" icon="i-lucide-list-ordered" color="neutral" variant="ghost" @click="arrangeColumns" /></div>
          <UCard v-for="(column, index) in form.columns" :key="column.id">
            <template #header><div class="flex flex-wrap items-center justify-between gap-2"><h3 class="font-semibold">Колонка {{ index + 1 }}</h3><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять колонку ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveColumn(index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить колонку ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.columns.length - 1" @click="moveColumn(index, 1)" /><UButton label="Удалить" icon="i-lucide-trash-2" :aria-label="`Удалить колонку ${index + 1}`" color="error" variant="ghost" @click="removeColumn(index)" /></div></div></template>
            <div class="space-y-5"><div class="grid gap-4 tablet:grid-cols-[1fr_160px]"><UFormField :label="`Название колонки ${index + 1}`"><UInput v-model="column.title" :aria-label="`Название колонки ${index + 1}`" maxlength="120" class="w-full" /></UFormField><UFormField :label="`Сортировка колонки ${index + 1}`"><UInput v-model.number="column.sortOrder" type="number" min="0" max="999999" :aria-label="`Сортировка колонки ${index + 1}`" class="w-full" /></UFormField></div><AdminFooterEntriesEditor v-model="column.items" :label="`Колонка ${index + 1}`" /></div>
          </UCard>
          <UButton label="Добавить колонку" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.columns.length >= 8" @click="addColumn" />
          <UCard><template #header><h2 class="font-semibold">Кнопка</h2></template><UFormField label="Текст кнопки"><UInput v-model="form.buttonLabel" aria-label="Текст кнопки футера" maxlength="60" class="w-full max-w-96" /></UFormField></UCard>
          <UCard><template #header><h2 class="font-semibold">Left bottom · нижняя строка слева</h2></template><AdminFooterEntriesEditor v-model="form.leftBottom" label="Слева внизу" /></UCard>
          <UCard><template #header><h2 class="font-semibold">Right bottom · нижняя строка справа</h2></template><AdminFooterEntriesEditor v-model="form.rightBottom" label="Справа внизу" /></UCard>
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
