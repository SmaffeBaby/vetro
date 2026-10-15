<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, discard, addLeftItem, addRightItem, removeItem, moveItem } = useAdminAboutCard()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight">AboutCard</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликован' }}</UBadge></div><p class="text-sm text-slate-500">Блок о компании под компетенциями: показатели, основной текст и список преимуществ.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <div v-if="loading" class="space-y-5"><USkeleton class="h-64 w-full" /><USkeleton class="h-48 w-full" /></div>
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" id="about-card-settings" @submit.prevent="save">
        <fieldset :disabled="saving" class="space-y-6">
          <UCard>
            <template #header><div class="flex items-center justify-between gap-3"><div><h2 class="font-semibold">Left text · показатели слева</h2><p class="mt-1 text-sm text-slate-500">У каждого показателя свой заголовок и текст.</p></div><UBadge color="neutral" variant="subtle">{{ form.leftItems.length }} / 12</UBadge></div></template>
            <div class="space-y-4">
              <div v-for="(item, index) in form.leftItems" :key="item.id" class="space-y-4 rounded-lg border border-slate-200 p-4">
                <div class="flex items-center justify-between gap-3"><h3 class="text-sm font-medium">Показатель {{ index + 1 }}</h3><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять показатель ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveItem('leftItems', index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить показатель ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.leftItems.length - 1" @click="moveItem('leftItems', index, 1)" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить показатель ${index + 1}`" color="error" variant="ghost" @click="removeItem('leftItems', index)" /></div></div>
                <UFormField :label="`Заголовок показателя ${index + 1}`"><UInput v-model="item.title" :aria-label="`Заголовок показателя ${index + 1}`" placeholder="100+" maxlength="120" class="w-full" /></UFormField>
                <UFormField :label="`Текст показателя ${index + 1}`"><UTextarea v-model="item.text" :aria-label="`Текст показателя ${index + 1}`" placeholder="объектов под защитой" maxlength="500" :rows="2" class="w-full" /></UFormField>
              </div>
              <p v-if="!form.leftItems.length" class="text-sm text-slate-500">Показателей пока нет.</p>
              <UButton label="Добавить показатель" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.leftItems.length >= 12" @click="addLeftItem" />
            </div>
          </UCard>
          <UCard>
            <template #header><h2 class="font-semibold">Center · центральный текст</h2></template>
            <UFormField label="Центральный текст" description="Переносы строк сохраняются. Под текстом расположена кнопка «Написать нам»."><UTextarea v-model="form.centerText" aria-label="Центральный текст" maxlength="2000" :rows="5" class="w-full" /></UFormField>
          </UCard>
          <UCard>
            <template #header><div class="flex items-center justify-between gap-3"><div><h2 class="font-semibold">Right · список справа</h2><p class="mt-1 text-sm text-slate-500">Каждый текст отображается отдельным пунктом с голубой точкой.</p></div><UBadge color="neutral" variant="subtle">{{ form.rightItems.length }} / 12</UBadge></div></template>
            <div class="space-y-4">
              <div v-for="(item, index) in form.rightItems" :key="item.id" class="space-y-3 rounded-lg border border-slate-200 p-4">
                <div class="flex items-center justify-between gap-3"><h3 class="text-sm font-medium">Пункт {{ index + 1 }}</h3><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять пункт справа ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveItem('rightItems', index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить пункт справа ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.rightItems.length - 1" @click="moveItem('rightItems', index, 1)" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить пункт справа ${index + 1}`" color="error" variant="ghost" @click="removeItem('rightItems', index)" /></div></div>
                <UFormField :label="`Текст справа ${index + 1}`"><UTextarea v-model="item.text" :aria-label="`Текст справа ${index + 1}`" maxlength="2000" :rows="4" class="w-full" /></UFormField>
              </div>
              <p v-if="!form.rightItems.length" class="text-sm text-slate-500">Пунктов пока нет.</p>
              <UButton label="Добавить пункт" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.rightItems.length >= 12" @click="addRightItem" />
            </div>
          </UCard>
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
