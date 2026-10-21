<script setup lang="ts">
import type { ContactFormSettings, ContactFormFieldId } from '#shared/types/contacts'
defineProps<{ form: ContactFormSettings }>()
const fields: { id: ContactFormFieldId; title: string }[] = [
  { id: 'name', title: 'Имя' }, { id: 'phone', title: 'Телефон' }, { id: 'email', title: 'E-mail' },
  { id: 'subject', title: 'Тема обращения' }, { id: 'message', title: 'Сообщение' }
]
</script>

<template>
  <UCard>
    <template #header><h2 class="font-semibold">Напишите нам</h2><p class="mt-1 text-sm text-slate-500">Оформление блока и полей формы на странице контактов. Отправка сообщений пока не подключена.</p></template>
    <div class="space-y-6">
      <USwitch v-model="form.enabled" label="Показывать блок «Напишите нам»" />
      <UFormField label="Заголовок блока"><UInput v-model="form.title" maxlength="240" class="w-full" /></UFormField>
      <UFormField label="Текст блока"><UTextarea v-model="form.text" :rows="3" maxlength="4000" class="w-full" /></UFormField>
      <UFormField label="Заголовок над телефоном"><UInput v-model="form.phoneTitle" maxlength="240" class="w-full" /></UFormField>
      <UFormField label="Телефон для звонка" description="Можно оставить пустым, чтобы скрыть телефонный блок."><UInput v-model="form.phoneText" maxlength="120" class="w-full" /></UFormField>
      <UFormField label="Ссылка телефона"><UInput v-model="form.phoneHref" placeholder="tel:+79117200510" maxlength="100" class="w-full" /></UFormField>
      <div v-for="field in fields" :key="field.id" class="space-y-4 rounded-xl border border-slate-200 p-5">
        <h3 class="font-semibold">Поле «{{ field.title }}»</h3>
        <UFormField :label="`Подпись: ${field.title}`"><UInput v-model="form.fields[field.id].label" maxlength="120" class="w-full" /></UFormField>
        <UFormField :label="`Подсказка: ${field.title}`"><UInput v-model="form.fields[field.id].placeholder" maxlength="240" class="w-full" /></UFormField>
        <USwitch v-model="form.fields[field.id].required" label="Обязательное поле" />
      </div>
      <div class="space-y-3">
        <h3 class="font-semibold">Темы обращения</h3>
        <div v-for="(_, index) in form.topics" :key="index" class="flex gap-3"><UInput v-model="form.topics[index]" :aria-label="`Тема обращения ${index + 1}`" maxlength="160" class="flex-1" /><UButton label="Удалить" color="error" variant="outline" @click="form.topics.splice(index, 1)" /></div>
        <UButton label="Добавить тему" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="form.topics.length >= 30" @click="form.topics.push('')" />
      </div>
      <UFormField label="Текст согласия"><UTextarea v-model="form.consentText" maxlength="2000" class="w-full" /></UFormField>
      <USwitch v-model="form.consentRequired" label="Обязательное согласие" />
      <UFormField label="Подпись кнопки"><UInput v-model="form.buttonLabel" maxlength="80" class="w-full" /></UFormField>
    </div>
  </UCard>
</template>
