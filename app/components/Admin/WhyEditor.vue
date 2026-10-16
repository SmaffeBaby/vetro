<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, iconPreview, load, save, addCard, removeCard, moveCard, sortCards, addPoint, removePoint, uploadSvg, removeSvg, discard } = useAdminWhy()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight">Почему мы</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликованы' }}</UBadge></div><p class="text-sm text-slate-500">Первая карточка раскрыта по умолчанию. Меньшее значение сортировки показывается раньше.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <USkeleton v-if="loading" class="h-80 w-full" />
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" @submit.prevent="save"><fieldset :disabled="saving" class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3"><h2 class="text-lg font-semibold">Карточки ({{ form.cards.length }} / 12)</h2><UButton label="Упорядочить по сортировке" icon="i-lucide-list-ordered" color="neutral" variant="outline" @click="sortCards" /></div>
        <UCard v-for="(item, index) in form.cards" :key="item.id">
          <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h3 class="font-semibold">Карточка {{ index + 1 }}</h3><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять карточку ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveCard(index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить карточку ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.cards.length - 1" @click="moveCard(index, 1)" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить карточку ${index + 1}`" color="error" variant="ghost" @click="removeCard(index)" /></div></div></template>
          <div class="space-y-5">
            <UFormField :label="`Сортировка карточки ${index + 1}`"><UInput v-model.number="item.sortOrder" type="number" min="0" max="999999" :aria-label="`Сортировка карточки ${index + 1}`" /></UFormField>
            <div class="grid gap-5 tablet:grid-cols-[1fr_120px]"><UFormField :label="`SVG карточки ${index + 1}`" description="SVG-файл до 200 КБ или код. Загрузка и удаление применяются при сохранении."><UTextarea v-model="item.svg" :aria-label="`SVG карточки ${index + 1}`" :rows="4" class="w-full" :ui="{ base: 'font-mono text-xs' }" /></UFormField><div class="flex min-h-28 items-center justify-center rounded-xl bg-[#2a9ccf] p-4"><img v-if="item.svg" :src="iconPreview(item)" :alt="`Иконка карточки ${index + 1}`" class="max-h-16 max-w-full"><span v-else class="text-xs text-white/70">Нет SVG</span></div></div>
            <div class="flex flex-wrap gap-3"><label class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><UIcon name="i-lucide-upload" class="size-4" />Загрузить SVG<input type="file" accept="image/svg+xml,.svg" :aria-label="`Загрузить SVG карточки ${index + 1}`" class="sr-only" @change="uploadSvg($event, item)"></label><UButton label="Удалить SVG" icon="i-lucide-trash-2" color="error" variant="outline" :disabled="!item.svg" @click="removeSvg(item)" /></div>
            <UFormField :label="`Заголовок карточки ${index + 1}`"><UTextarea v-model="item.title" :aria-label="`Заголовок карточки ${index + 1}`" :rows="2" maxlength="160" class="w-full" /></UFormField>
            <div class="space-y-3"><h4 class="text-sm font-medium">Текст с точкой ({{ item.points.length }} / 12)</h4><div v-for="(_, pointIndex) in item.points" :key="pointIndex" class="flex items-start gap-3"><span class="mt-4 size-1.5 shrink-0 rounded-full bg-[#2a9ccf]" aria-hidden="true" /><UTextarea v-model="item.points[pointIndex]" :aria-label="`Пункт ${pointIndex + 1} карточки ${index + 1}`" :rows="2" maxlength="2000" class="w-full" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить пункт ${pointIndex + 1} карточки ${index + 1}`" color="error" variant="ghost" @click="removePoint(item, pointIndex)" /></div><UButton label="Добавить пункт" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="item.points.length >= 12" @click="addPoint(item)" /></div>
          </div>
        </UCard>
        <p v-if="!form.cards.length" class="text-sm text-slate-500">Карточек пока нет. Пустой раздел скрыт на сайте.</p>
        <UButton label="Добавить карточку" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.cards.length >= 12" @click="addCard" />
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
      </fieldset></form>
    </div>
  </div>
</template>
