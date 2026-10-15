<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, iconPreview, load, save, addQuestion, addBenefit, removeItem, moveItem, uploadSvg, removeSvg, discard } = useAdminFaq()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight">Вопросы</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликованы' }}</UBadge></div><p class="text-sm text-slate-500">Часто задаваемые вопросы и карточка преимуществ перед контактами.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <div v-if="loading" class="space-y-5"><USkeleton class="h-64 w-full" /><USkeleton class="h-80 w-full" /></div>
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" id="faq-settings" @submit.prevent="save">
        <fieldset :disabled="saving" class="space-y-6">
          <h2 class="text-lg font-semibold">Левый список · вопросы и ответы ({{ form.questions.length }} / 30)</h2>
          <UCard v-for="(item, index) in form.questions" :key="item.id">
            <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h3 class="font-semibold">Вопрос {{ index + 1 }}</h3><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять вопрос ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveItem('questions', index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить вопрос ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.questions.length - 1" @click="moveItem('questions', index, 1)" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить вопрос ${index + 1}`" color="error" variant="ghost" @click="removeItem('questions', index)" /></div></div></template>
            <div class="space-y-5"><UFormField :label="`Вопрос ${index + 1}`"><UTextarea v-model="item.question" :aria-label="`Вопрос ${index + 1}`" :rows="2" maxlength="300" class="w-full" /></UFormField><UFormField :label="`Ответ ${index + 1}`" description="Текст раскрывается при нажатии на вопрос. Переносы строк сохраняются."><UTextarea v-model="item.answer" :aria-label="`Ответ ${index + 1}`" :rows="4" maxlength="5000" class="w-full" /></UFormField></div>
          </UCard>
          <p v-if="!form.questions.length" class="text-sm text-slate-500">Вопросов пока нет.</p>
          <UButton label="Добавить вопрос" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.questions.length >= 30" @click="addQuestion" />
          <h2 class="pt-4 text-lg font-semibold">Карточка справа · преимущества ({{ form.benefits.length }} / 12)</h2>
          <UCard v-for="(item, index) in form.benefits" :key="item.id">
            <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h3 class="font-semibold">Преимущество {{ index + 1 }}</h3><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять преимущество ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveItem('benefits', index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить преимущество ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.benefits.length - 1" @click="moveItem('benefits', index, 1)" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить преимущество ${index + 1}`" color="error" variant="ghost" @click="removeItem('benefits', index)" /></div></div></template>
            <div class="space-y-5">
              <div class="grid gap-5 tablet:grid-cols-[1fr_120px]"><UFormField :label="`SVG преимущества ${index + 1}`" description="Код SVG или файл до 200 КБ. Загрузка и удаление применяются при сохранении."><UTextarea v-model="item.svg" :aria-label="`SVG преимущества ${index + 1}`" :rows="4" class="w-full" :ui="{ base: 'font-mono text-xs' }" /></UFormField><div class="flex min-h-28 items-center justify-center rounded-xl bg-[#2a9ccf] p-4"><img v-if="item.svg" :src="iconPreview(item)" :alt="`Иконка преимущества ${index + 1}`" class="max-h-16 max-w-full"><span v-else class="text-xs text-white/70">Нет SVG</span></div></div>
              <div class="flex flex-wrap gap-3"><label class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><UIcon name="i-lucide-upload" class="size-4" />Загрузить SVG<input type="file" accept="image/svg+xml,.svg" :aria-label="`Загрузить SVG преимущества ${index + 1}`" class="sr-only" @change="uploadSvg($event, item)"></label><UButton label="Удалить SVG" icon="i-lucide-trash-2" color="error" variant="outline" :disabled="!item.svg" @click="removeSvg(item)" /></div>
              <UFormField :label="`Заголовок преимущества ${index + 1}`"><UInput v-model="item.title" :aria-label="`Заголовок преимущества ${index + 1}`" maxlength="160" class="w-full" /></UFormField>
              <UFormField :label="`Текст преимущества ${index + 1}`"><UTextarea v-model="item.text" :aria-label="`Текст преимущества ${index + 1}`" :rows="3" maxlength="2000" class="w-full" /></UFormField>
            </div>
          </UCard>
          <p v-if="!form.benefits.length" class="text-sm text-slate-500">Преимуществ пока нет.</p>
          <UButton label="Добавить преимущество" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.benefits.length >= 12" @click="addBenefit" />
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
