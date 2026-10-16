<script setup lang="ts">
const { data: services, error: servicesError, refresh: reloadServices } = await useServices()
const { options, selectedId, previewHref, selectService, form, loading, saving, loaded, error, notice, isDirty, logoPreview, updatedLabel, save, load, discard, uploadLogo, removeLogo } = useAdminServiceRequest(() => servicesError.value ? [] : services.value.cards)
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold">Оставьте заявку</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликован' }}</UBadge></div><p class="text-sm text-slate-500">Блок заявки на детальной странице. Поля и SVG сохраняются независимо для каждой услуги.</p></div>
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
        <UCard><template #header><h2 class="font-semibold">Тексты и кнопка</h2></template><div class="space-y-5">
          <UFormField label="Заголовок"><UTextarea v-model="form.title" aria-label="Заголовок Оставьте заявку" :rows="2" maxlength="240" class="w-full" /></UFormField>
          <UFormField label="Описание"><UTextarea v-model="form.description" aria-label="Описание блока заявки" :rows="4" maxlength="4000" class="w-full" /></UFormField>
          <UFormField label="Пояснительный текст" description="Необязательное поле. Пустая плашка на сайте скрывается."><UTextarea v-model="form.note" aria-label="Пояснительный текст блока заявки" :rows="3" maxlength="2000" class="w-full" /></UFormField>
          <UFormField label="Текст кнопки" description="Кнопка ведёт к контактам на главной странице."><UInput v-model="form.buttonLabel" aria-label="Текст кнопки Оставьте заявку" maxlength="80" class="w-full" /></UFormField>
        </div></UCard>
        <UCard><template #header><h2 class="font-semibold">Логотип SVG</h2><p class="mt-1 text-sm text-slate-500">Media / Services / DetailServices / RequestCard. Загрузка и удаление применяются при сохранении.</p></template>
          <div class="grid gap-6 tablet:grid-cols-[1fr_240px]">
            <div class="space-y-4"><UFormField label="SVG-код" description="Самостоятельный SVG до 200 КБ, без скриптов и внешних ресурсов."><UTextarea v-model="form.svg" aria-label="SVG изображение Оставьте заявку" :rows="7" class="w-full" :ui="{ base: 'font-mono text-xs' }" /></UFormField>
              <div class="flex flex-wrap gap-3"><label class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><UIcon name="i-lucide-upload" class="size-4" />Загрузить SVG<input type="file" accept="image/svg+xml,.svg" aria-label="Загрузить SVG Оставьте заявку" class="sr-only" @change="uploadLogo"></label><UButton label="Удалить SVG" icon="i-lucide-trash-2" color="error" variant="outline" :disabled="!form.svg" @click="removeLogo" /></div>
              <p class="text-xs text-slate-500">{{ form.svg ? form.filename : 'Изображение отсутствует' }}</p>
            </div>
            <div class="flex min-h-36 items-center justify-center rounded-xl bg-[#203b5c] p-6"><img v-if="form.svg" :src="logoPreview" alt="Предпросмотр изображения Оставьте заявку" class="max-h-32 max-w-full"><span v-else class="text-sm text-white/60">Нет SVG</span></div>
          </div>
        </UCard>
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
      </fieldset></form>
    </div>
  </div>
</template>
