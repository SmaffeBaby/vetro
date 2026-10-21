<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, imagePreview, load, save, selectImage, removeImage, discard } = useAdminAboutHero()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><h1 class="text-2xl font-semibold">Hero-компонент</h1><p class="mt-2 text-sm text-slate-500">Первый экран страницы «О компании»: хлебные крошки, заголовок, текст и фото.</p></div>
      <div class="flex flex-wrap gap-2"><UButton to="/about" target="_blank" label="Открыть страницу" color="neutral" variant="outline" /><UButton label="Отменить" color="neutral" variant="outline" :disabled="saving || !isDirty" @click="discard" /><UButton label="Сохранить" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <USkeleton v-if="loading" class="h-80 w-full" />
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" :description="notice" role="status" />
      <form v-if="loaded" @submit.prevent="save"><fieldset :disabled="saving" class="space-y-6">
        <UCard><template #header><h2 class="font-semibold">Текст</h2></template><div class="space-y-5">
          <UFormField label="Название в хлебных крошках"><UInput v-model="form.breadcrumb" maxlength="120" class="w-full" /></UFormField>
          <UFormField label="Заголовок страницы"><UInput v-model="form.title" maxlength="240" class="w-full" /></UFormField>
          <UFormField label="Подзаголовок слева"><UTextarea v-model="form.subtitle" :rows="2" maxlength="500" class="w-full" /></UFormField>
          <UFormField label="Текст справа" description="Разделяйте абзацы пустой строкой."><UTextarea v-model="form.text" :rows="9" maxlength="12000" class="w-full" /></UFormField>
        </div></UCard>
        <UCard><template #header><h2 class="font-semibold">Фотография</h2><p class="mt-1 text-sm text-slate-500">PNG, JPEG или WebP до 5 МБ. Изменения применяются при сохранении.</p></template><div class="space-y-5">
          <img v-if="imagePreview" :src="imagePreview" :alt="form.imageAlt" class="max-h-96 w-full rounded-2xl object-contain" />
          <div class="flex flex-wrap gap-3"><label class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><UIcon name="i-lucide-upload" class="size-4" />Загрузить фото<input type="file" accept="image/png,image/jpeg,image/webp" aria-label="Загрузить фото о компании" class="sr-only" @change="selectImage"></label><UButton label="Удалить фото" color="error" variant="outline" :disabled="!imagePreview" @click="removeImage" /></div>
          <UFormField label="Описание фото (alt)"><UInput v-model="form.imageAlt" maxlength="500" class="w-full" /></UFormField>
        </div></UCard>
        <UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" />
      </fieldset></form>
    </div>
  </div>
</template>
