<script setup lang="ts">
import { serviceIncludedHref } from '#shared/utils/services-included'
const { form, options, selectedId, loading, saving, loaded, error, notice, isDirty, load, save, discard, selectService, addItem, moveItem } = useAdminServicesIncluded()
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-8 tablet:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><h1 class="text-2xl font-semibold">Пункты услуги и их страницы</h1><p class="mt-2 text-sm text-slate-500">Карточки блока «Что входит в услугу» и отдельная страница каждого пункта. Данные сохраняются для выбранной услуги.</p></div>
      <div class="flex gap-2"><UButton label="Отменить" color="neutral" variant="outline" :disabled="saving || !isDirty" @click="discard" /><UButton label="Сохранить" :loading="saving" :disabled="loading || !isDirty" @click="save" /></div>
    </div>
    <UFormField label="Услуга" class="mb-6"><USelect :model-value="selectedId" :items="options" :disabled="saving || !options.length" class="w-full" @update:model-value="selectService($event)" /></UFormField>
    <UAlert v-if="error" color="error" :description="error" class="mb-6"><template #actions><UButton label="Загрузить заново" :disabled="saving" @click="load" /></template></UAlert>
    <UAlert v-if="notice" color="success" :description="notice" class="mb-6" />
    <USkeleton v-if="loading" class="h-80 w-full" />
    <form v-else-if="loaded" @submit.prevent="save"><fieldset :disabled="saving" class="space-y-6">
      <UCard><template #header><h2 class="font-semibold">Блок «Что входит в услугу»</h2></template>
        <div class="space-y-4">
          <UFormField label="Заголовок блока"><UInput v-model="form.title" maxlength="240" class="w-full" /></UFormField>
          <UFormField label="Описание блока"><UTextarea v-model="form.text" maxlength="4000" class="w-full" /></UFormField>
          <UFormField label="Подпись кнопки карточек"><UInput v-model="form.buttonLabel" maxlength="80" class="w-full" /></UFormField>
        </div>
      </UCard>
      <p v-if="!form.items.length" class="text-sm text-slate-500">Пунктов пока нет. Добавьте первый пункт, чтобы показать блок на сайте.</p>
      <UCard v-for="(item, index) in form.items" :key="index">
        <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-semibold">{{ index + 1 }}. {{ item.title || 'Новый пункт' }}</h2><div class="flex gap-2"><UButton icon="i-lucide-arrow-up" aria-label="Переместить выше" color="neutral" variant="outline" :disabled="index === 0" @click="moveItem(index, -1)" /><UButton icon="i-lucide-arrow-down" aria-label="Переместить ниже" color="neutral" variant="outline" :disabled="index === form.items.length - 1" @click="moveItem(index, 1)" /><UButton label="Удалить" color="error" variant="outline" @click="form.items.splice(index, 1)" /></div></div></template>
        <div class="space-y-5">
          <UFormField label="Адрес страницы (ID)" description="Латинские буквы, цифры, дефис и подчёркивание. Изменение ID меняет ссылку на страницу."><UInput v-model="item.id" maxlength="80" class="w-full" /></UFormField>
          <h3 class="font-semibold">Карточка пункта</h3>
          <UFormField label="Название пункта"><UInput v-model="item.title" maxlength="240" class="w-full" /></UFormField>
          <UFormField label="Описание карточки"><UTextarea v-model="item.text" maxlength="4000" class="w-full" /></UFormField>
          <h3 class="font-semibold">Детальная страница пункта</h3>
          <UFormField label="Заголовок страницы"><UInput v-model="item.detailTitle" maxlength="240" class="w-full" /></UFormField>
          <UFormField label="Текст первого экрана"><UTextarea v-model="item.detailText" :rows="4" maxlength="4000" class="w-full" /></UFormField>
          <UFormField label="Подпись кнопки заявки"><UInput v-model="item.buttonLabel" maxlength="80" class="w-full" /></UFormField>
          <UFormField label="Подробное описание" description="Необязательный текст под первым экраном. Переносы строк сохраняются. Фоновое изображение используется из первого экрана основной услуги."><UTextarea v-model="item.body" :rows="6" maxlength="20000" class="w-full" /></UFormField>
          <UButton :to="serviceIncludedHref(selectedId, item.id)" target="_blank" label="Открыть опубликованную страницу" icon="i-lucide-external-link" color="neutral" variant="outline" />
        </div>
      </UCard>
      <div class="flex flex-wrap gap-3"><UButton label="Добавить пункт" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.items.length >= 100" @click="addItem" /><UButton type="submit" label="Сохранить изменения" :loading="saving" :disabled="!isDirty" /></div>
    </fieldset></form>
  </div>
</template>
