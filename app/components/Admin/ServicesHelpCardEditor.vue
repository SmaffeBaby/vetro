<script setup lang="ts">
const props=withDefaults(defineProps<{kind?:'services'|'objects'|'objects-detail'|'about-project'}>(),{kind:'services'})
const { editorTitle, mediaDirectory, description, form, loading, saving, loaded, error, notice, isDirty, logoPreview, updatedLabel, save, load, discard, uploadLogo, removeLogo } = useAdminServicesHelpCard(props.kind)
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold">{{ editorTitle }}</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликован' }}</UBadge></div><p class="text-sm text-slate-500">{{ description }}</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <USkeleton v-if="loading" class="h-80 w-full" />
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" @submit.prevent="save"><fieldset :disabled="saving" class="space-y-6">
        <UCard><template #header><h2 class="font-semibold">Заголовок, текст и кнопка</h2></template><div class="space-y-5">
          <UFormField label="Заголовок"><UTextarea v-model="form.title" :aria-label="`Заголовок ${editorTitle}`" :rows="2" maxlength="240" class="w-full" /></UFormField>
          <UFormField label="Текст"><UTextarea v-model="form.text" :aria-label="`Текст ${editorTitle}`" :rows="4" maxlength="3000" class="w-full" /></UFormField>
          <UFormField label="Текст кнопки" :description="kind === 'about-project' ? 'Кнопка ведёт к форме на странице контактов.' : 'Кнопка ведёт к контактам на главной странице.'"><UInput v-model="form.buttonLabel" :aria-label="`Текст кнопки ${editorTitle}`" maxlength="80" class="w-full" /></UFormField>
        </div></UCard>
        <UCard><template #header><h2 class="font-semibold">SVG изображение</h2><p class="mt-1 text-sm text-slate-500">Media / {{ mediaDirectory }}. Загрузка и удаление применяются при сохранении.</p></template>
          <div class="grid gap-6 tablet:grid-cols-[1fr_240px]">
            <div class="space-y-4"><UFormField label="SVG-код" description="Самостоятельный SVG до 200 КБ, без скриптов и внешних ресурсов."><UTextarea v-model="form.svg" :aria-label="`SVG изображение ${editorTitle}`" :rows="7" class="w-full" :ui="{ base: 'font-mono text-xs' }" /></UFormField>
              <div class="flex flex-wrap gap-3"><label class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><UIcon name="i-lucide-upload" class="size-4" />Загрузить SVG<input type="file" accept="image/svg+xml,.svg" :aria-label="`Загрузить SVG ${editorTitle}`" class="sr-only" @change="uploadLogo"></label><UButton label="Удалить SVG" icon="i-lucide-trash-2" color="error" variant="outline" :disabled="!form.svg" @click="removeLogo" /></div>
              <p class="text-xs text-slate-500">{{ form.svg ? form.filename : 'Изображение отсутствует' }}</p>
            </div>
            <div class="flex min-h-36 items-center justify-center rounded-xl bg-[#203b5c] p-6"><img v-if="form.svg" :src="logoPreview" :alt="`Предпросмотр ${editorTitle}`" class="max-h-32 max-w-full"><span v-else class="text-sm text-white/60">Нет SVG</span></div>
          </div>
        </UCard>
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
      </fieldset></form>
    </div>
  </div>
</template>
