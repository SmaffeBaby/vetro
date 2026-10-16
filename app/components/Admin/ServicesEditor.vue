<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, iconPreview, load, save, addCard, removeCard, arrangeCards, moveCard, uploadSvg, discard } = useAdminServices()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight">Услуги</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликованы' }}</UBadge></div><p class="text-sm text-slate-500">Заголовок, описание и карточки страницы /services.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <div v-if="loading" class="space-y-5"><USkeleton class="h-64 w-full" /><USkeleton class="h-64 w-full" /></div>
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" id="services-settings" @submit.prevent="save">
        <fieldset :disabled="saving" class="space-y-6">
          <UCard><template #header><h2 class="font-semibold">Заголовок и текст</h2></template><div class="space-y-5"><UFormField label="Заголовок страницы"><UInput v-model="form.title" aria-label="Заголовок страницы" maxlength="160" class="w-full" /></UFormField><UFormField label="Текст страницы"><UTextarea v-model="form.text" aria-label="Текст страницы" :rows="4" maxlength="3000" class="w-full" /></UFormField></div></UCard>
          <div class="flex flex-wrap items-center justify-between gap-3"><p class="text-sm text-slate-500">{{ form.cards.length }} / 12 карточек · меньшая сортировка идёт первой</p><UButton label="Упорядочить по сортировке" icon="i-lucide-list-ordered" color="neutral" variant="ghost" @click="arrangeCards" /></div>
          <UCard v-for="(card, index) in form.cards" :key="card.id">
            <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="min-w-0 truncate font-semibold">Карточка {{ index + 1 }}<span v-if="card.title" class="font-normal text-slate-400"> · {{ card.title }}</span></h2><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять карточку ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveCard(index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить карточку ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.cards.length - 1" @click="moveCard(index, 1)" /><UButton label="Удалить" icon="i-lucide-trash-2" :aria-label="`Удалить карточку ${index + 1}`" color="error" variant="ghost" @click="removeCard(index)" /></div></div></template>
            <div class="space-y-5">
              <div class="grid gap-5 tablet:grid-cols-[1fr_120px]">
                <div class="space-y-3"><UFormField :label="`SVG карточки ${index + 1}`" description="Код SVG или загрузка файла до 200 КБ."><UTextarea v-model="card.svg" :aria-label="`SVG карточки ${index + 1}`" :rows="4" class="w-full" :ui="{ base: 'font-mono text-xs' }" /></UFormField><label class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><UIcon name="i-lucide-upload" class="size-4" />Загрузить SVG<input type="file" accept="image/svg+xml,.svg" :aria-label="`Загрузить SVG карточки ${index + 1}`" class="sr-only" @change="uploadSvg($event, card)"></label></div>
                <div class="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4"><img v-if="card.svg" :src="iconPreview(card)" :alt="`Иконка карточки ${index + 1}`" class="max-h-16 max-w-full"><span v-else class="text-xs text-slate-400">Нет SVG</span></div>
              </div>
              <div class="grid gap-5 tablet:grid-cols-[140px_1fr]"><UFormField :label="`Сортировка карточки ${index + 1}`"><UInput v-model.number="card.sortOrder" type="number" min="0" max="999999" step="1" :aria-label="`Сортировка карточки ${index + 1}`" class="w-full" /></UFormField><UFormField :label="`Заголовок карточки ${index + 1}`"><UInput v-model="card.title" :aria-label="`Заголовок карточки ${index + 1}`" maxlength="160" class="w-full" /></UFormField></div>
              <UFormField :label="`Текст карточки ${index + 1}`" description="Описание услуги. Переносы строк сохраняются."><UTextarea v-model="card.text" :aria-label="`Текст карточки ${index + 1}`" :rows="3" maxlength="1000" class="w-full" /></UFormField>
            </div>
          </UCard>
          <div v-if="!form.cards.length" class="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">Карточек пока нет. Добавьте первую — пустой блок не отображается на сайте.</div>
          <UButton label="Добавить карточку" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.cards.length >= 12" @click="addCard" />
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
