<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, imagePreview, selectedFile, load, save, selectImage, removeImage, discard, addRegalia, removeRegalia, moveRegalia } = useAdminHero()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight">Hero</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликован' }}</UBadge></div><p class="text-sm text-slate-500">Первый экран главной страницы: заголовок, регалии, кнопки и изображение.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <div v-if="loading" class="space-y-5"><USkeleton class="h-64 w-full" /><USkeleton class="h-80 w-full" /></div>
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" id="hero-settings" @submit.prevent="save">
        <fieldset :disabled="saving" class="space-y-6">
          <UCard>
            <template #header><h2 class="font-semibold">Заголовок и текст</h2></template>
            <div class="space-y-5">
              <UFormField label="Заголовок" description="Переносы строк сохраняются."><UTextarea v-model="form.title" aria-label="Заголовок" name="title" :rows="3" maxlength="240" class="w-full" /></UFormField>
              <UFormField label="Акцентная строка" description="Голубая строка под заголовком, например «под ключ»."><UInput v-model="form.accentTitle" aria-label="Акцентная строка" name="accentTitle" maxlength="120" class="w-full" /></UFormField>
              <UFormField label="Текст" description="Необязательное описание под заголовком."><UTextarea v-model="form.text" aria-label="Текст" name="text" maxlength="1000" class="w-full" /></UFormField>
            </div>
          </UCard>
          <UCard>
            <template #header><div class="flex items-center justify-between"><h2 class="font-semibold">Регалии</h2><UBadge color="neutral" variant="subtle">{{ form.regalia.length }} / 12</UBadge></div></template>
            <div class="space-y-3">
              <p v-if="!form.regalia.length" class="text-sm text-slate-500">Добавьте преимущества компании.</p>
              <div v-for="(_, index) in form.regalia" :key="index" class="flex flex-wrap items-end gap-2">
                <UFormField :label="`Регалия ${index + 1}`" class="min-w-40 flex-1"><UInput v-model="form.regalia[index]" :aria-label="`Регалия ${index + 1}`" :name="`regalia-${index}`" maxlength="120" class="w-full" /></UFormField>
                <UButton icon="i-lucide-arrow-up" :aria-label="`Поднять регалию ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveRegalia(index, -1)" />
                <UButton icon="i-lucide-arrow-down" :aria-label="`Опустить регалию ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.regalia.length - 1" @click="moveRegalia(index, 1)" />
                <UButton icon="i-lucide-trash-2" :aria-label="`Удалить регалию ${index + 1}`" color="error" variant="ghost" @click="removeRegalia(index)" />
              </div>
              <UButton label="Добавить регалию" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.regalia.length >= 12" @click="addRegalia" />
            </div>
          </UCard>
          <UCard>
            <template #header><h2 class="font-semibold">Изображение</h2></template>
            <div class="space-y-4">
              <div class="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4"><img v-if="imagePreview" :src="imagePreview" alt="Предпросмотр изображения Hero" class="max-h-80 max-w-full object-contain"><span v-else class="text-sm text-slate-400">Изображение не загружено</span></div>
              <p class="text-xs text-slate-500">PNG, JPEG, WebP, GIF, AVIF до 5 МБ или SVG до 200 КБ. Загрузка и удаление применяются после сохранения.</p>
              <div class="flex flex-wrap items-center gap-3"><label class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><UIcon name="i-lucide-upload" class="size-4" />Выбрать изображение<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml" aria-label="Выбрать изображение Hero" class="sr-only" @change="selectImage"></label><UButton label="Удалить изображение" icon="i-lucide-trash-2" color="error" variant="outline" :disabled="!imagePreview" @click="removeImage" /></div>
              <p v-if="imagePreview" class="break-all text-xs text-slate-500">{{ selectedFile ? selectedFile.name : form.imageFilename }}</p>
            </div>
          </UCard>
          <UCard>
            <template #header><h2 class="font-semibold">Кнопки</h2></template>
            <div class="grid gap-5 tablet:grid-cols-2"><UFormField label="Название первой кнопки"><UInput v-model="form.primaryButtonLabel" aria-label="Название первой кнопки" name="primaryButtonLabel" maxlength="60" class="w-full" /></UFormField><UFormField label="Название второй кнопки"><UInput v-model="form.secondaryButtonLabel" aria-label="Название второй кнопки" name="secondaryButtonLabel" maxlength="60" class="w-full" /></UFormField></div>
          </UCard>
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">{{ form.updatedAt ? `Сохранено: ${new Date(form.updatedAt).toLocaleString('ru-RU')}` : 'Ещё не сохранено' }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
