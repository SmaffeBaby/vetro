<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, imagePreview, selectedFile, load, save, selectImage, removeImage, discard } = useAdminLicense()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight">Лицензия</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликована' }}</UBadge></div><p class="text-sm text-slate-500">Фото лицензии, название и текст кнопки перед вопросами.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <div v-if="loading" class="space-y-5"><USkeleton class="h-64 w-full" /><USkeleton class="h-48 w-full" /></div>
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" id="license-settings" @submit.prevent="save">
        <fieldset :disabled="saving" class="space-y-6">
          <UCard>
            <template #header><h2 class="font-semibold">Фото лицензии</h2></template>
            <div class="space-y-4"><div class="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4"><img v-if="imagePreview" :src="imagePreview" alt="Предпросмотр фото лицензии" class="max-h-96 max-w-full object-contain"><span v-else class="text-sm text-slate-400">Фото не загружено</span></div><p class="text-xs text-slate-500">PNG, JPEG, WebP или AVIF до 5 МБ. Загрузка, замена и удаление применяются после сохранения.</p><div class="flex flex-wrap gap-3"><label class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><UIcon name="i-lucide-upload" class="size-4" />Выбрать фото<input type="file" accept="image/png,image/jpeg,image/webp,image/avif" aria-label="Выбрать фото лицензии" class="sr-only" @change="selectImage"></label><UButton label="Удалить фото" icon="i-lucide-trash-2" color="error" variant="outline" :disabled="!imagePreview" @click="removeImage" /></div><p v-if="imagePreview" class="break-all text-xs text-slate-500">{{ selectedFile ? selectedFile.name : form.imageFilename }}</p></div>
          </UCard>
          <UCard><template #header><h2 class="font-semibold">Тексты</h2></template><div class="space-y-5"><UFormField label="Название лицензии" description="Переносы строк сохраняются."><UTextarea v-model="form.title" aria-label="Название лицензии" maxlength="240" :rows="3" class="w-full" /></UFormField><UFormField label="Текст кнопки"><UInput v-model="form.buttonLabel" aria-label="Текст кнопки лицензии" maxlength="60" class="w-full" /></UFormField></div></UCard>
          <div class="flex flex-wrap items-center justify-end pb-4"><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
