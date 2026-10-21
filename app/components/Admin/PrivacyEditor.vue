<script setup lang="ts">
const { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, addCard, removeCard, moveCard, discard } = useAdminPrivacy()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><div class="mb-2 flex items-center gap-2"><h1 class="text-2xl font-semibold tracking-tight">Политика конфиденциальности</h1><UBadge v-if="loaded" :color="isDirty ? 'warning' : 'success'" variant="subtle">{{ isDirty ? 'Есть изменения' : 'Опубликована' }}</UBadge></div><p class="text-sm text-slate-500">Заголовок, оглавление и разделы страницы /privacy. Порядок разделов задаётся кнопками со стрелками.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="loading || saving || !isDirty" @click="discard" /><UButton label="Сохранить" icon="i-lucide-check" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <div v-if="loading" class="space-y-5"><USkeleton class="h-64 w-full" /><USkeleton class="h-64 w-full" /></div>
    <div v-else class="space-y-6">
      <UAlert v-if="error" color="error" variant="soft" :description="error" role="alert"><template #actions><UButton label="Загрузить заново" color="error" variant="outline" size="xs" :disabled="saving" @click="load" /></template></UAlert>
      <UAlert v-if="notice" color="success" variant="soft" :description="notice" role="status" />
      <form v-if="loaded" id="privacy-settings" @submit.prevent="save">
        <fieldset :disabled="saving" class="space-y-6">
          <UCard><UFormField label="Заголовок страницы"><UTextarea v-model="form.title" :rows="2" maxlength="240" class="w-full" /></UFormField></UCard>
          <UCard><div class="space-y-5">
            <UFormField label="Название в хлебных крошках"><UInput v-model="form.breadcrumb" maxlength="240" class="w-full" /></UFormField>
            <UFormField label="Вводный текст (необязательно)"><UTextarea v-model="form.intro" :rows="3" maxlength="4000" class="w-full" /></UFormField>
            <UFormField label="Название оглавления"><UInput v-model="form.navigationLabel" maxlength="120" class="w-full" /></UFormField>
          </div></UCard>
          <p class="text-sm text-slate-500">{{ form.sections.length }} / 50 разделов</p>
          <UCard v-for="(card, index) in form.sections" :key="card.id">
            <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-semibold">Раздел {{ index + 1 }}</h2><div class="flex gap-1"><UButton icon="i-lucide-arrow-up" :aria-label="`Поднять карточку ${index + 1}`" color="neutral" variant="ghost" :disabled="index === 0" @click="moveCard(index, -1)" /><UButton icon="i-lucide-arrow-down" :aria-label="`Опустить карточку ${index + 1}`" color="neutral" variant="ghost" :disabled="index === form.sections.length - 1" @click="moveCard(index, 1)" /><UButton icon="i-lucide-trash-2" :aria-label="`Удалить карточку ${index + 1}`" color="error" variant="ghost" :disabled="form.sections.length <= 1" @click="removeCard(index)" /></div></div></template>
            <div class="space-y-5">
              <UFormField label="Адрес раздела (ID)" description="Используется в ссылке на раздел. При смене ID изменится якорная ссылка."><UInput v-model="card.id" maxlength="80" class="w-full" /></UFormField>
              <UFormField :label="`Заголовок раздела ${index + 1}`"><UInput v-model="card.title" maxlength="240" class="w-full" /></UFormField>
              <UFormField :label="`Текст раздела ${index + 1}`" description="Переносы строк сохраняются."><UTextarea v-model="card.text" :rows="8" maxlength="20000" class="w-full" /></UFormField>
            </div>
          </UCard>
          <p v-if="!form.sections.length" class="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">Разделов пока нет. Добавьте хотя бы один раздел.</p>
          <UButton label="Добавить раздел" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.sections.length >= 50" @click="addCard" />
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4"><p class="text-xs text-slate-400">Сохранено: {{ updatedLabel }}</p><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
