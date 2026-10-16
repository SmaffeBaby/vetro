<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, addCard, removeCard, arrangeCards, moveCard, discard } = useAdminHowWork()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight">Работа</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликована' }}</UBadge></div><p class="text-sm text-slate-500">Карточки блока «Как мы работаем?». Первая раскрывается автоматически, остальные — при нажатии.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <div v-if="loading" class="space-y-5"><USkeleton class="h-64 w-full" /><USkeleton class="h-64 w-full" /></div>
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" id="how-work-settings" @submit.prevent="save">
        <fieldset :disabled="saving" class="space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-3"><p class="text-sm text-slate-500">{{ form.cards.length }} / 12 карточек · меньшая сортировка идёт первой</p><UButton label="Упорядочить по сортировке" icon="i-lucide-list-ordered" color="neutral" variant="ghost" @click="arrangeCards" /></div>
          <UCard v-for="(card, index) in form.cards" :key="card.id">
            <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-semibold">Карточка {{ index + 1 }}</h2><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять этап ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveCard(index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить этап ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.cards.length - 1" @click="moveCard(index, 1)" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить этап ${index + 1}`" color="error" variant="ghost" @click="removeCard(index)" /></div></div></template>
            <div class="space-y-5"><UFormField :label="`Сортировка этапа ${index + 1}`"><UInput v-model.number="card.sortOrder" type="number" min="0" max="999999" step="1" :aria-label="`Сортировка этапа ${index + 1}`" class="w-full max-w-48" /></UFormField><UFormField :label="`Заголовок этапа ${index + 1}`" description="Переносы строк сохраняются."><UTextarea v-model="card.title" :aria-label="`Заголовок этапа ${index + 1}`" :rows="2" maxlength="160" class="w-full" /></UFormField><UFormField :label="`Текст этапа ${index + 1}`"><UTextarea v-model="card.text" :aria-label="`Текст этапа ${index + 1}`" :rows="4" maxlength="3000" class="w-full" /></UFormField></div>
          </UCard>
          <p v-if="!form.cards.length" class="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">Карточек пока нет. Пустой блок не отображается на сайте.</p>
          <UButton label="Добавить карточку" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.cards.length >= 12" @click="addCard" />
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
