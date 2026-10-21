<script setup lang="ts">
import type { ContactsPageSettings, ContactSocial } from '#shared/types/contacts'
defineProps<{ page: ContactsPageSettings }>()
const emit = defineEmits<{ upload: [event: Event, social: ContactSocial]; remove: [social: ContactSocial] }>()
</script>

<template>
  <UCard><template #header><h2 class="font-semibold">Страница контактов</h2></template><div class="space-y-5">
    <UFormField label="Заголовок страницы"><UInput v-model="page.title" maxlength="240" class="w-full" /></UFormField>
    <UFormField label="Режим работы"><UTextarea v-model="page.hours" maxlength="1000" class="w-full" /></UFormField>
    <UFormField label="Заголовок реквизитов"><UInput v-model="page.requisitesTitle" maxlength="240" class="w-full" /></UFormField>
    <UFormField label="Реквизиты компании" description="Название, ИНН, ОГРН, юридический адрес и банковские реквизиты. Каждый пункт можно написать с новой строки. Пустой блок скрыт на сайте."><UTextarea v-model="page.requisites" :rows="7" maxlength="12000" class="w-full" /></UFormField>
  </div></UCard>
  <UCard><template #header><h2 class="font-semibold">Яндекс Карты</h2></template><div class="space-y-5">
    <UFormField label="Адрес виджета (src iframe)" description="Вставьте только адрес https://yandex.ru/map-widget/v1/ из атрибута src, без HTML-кода."><UTextarea v-model="page.mapSrc" :rows="3" maxlength="2048" class="w-full" /></UFormField>
    <UFormField label="Ссылка «Открыть на карте»"><UInput v-model="page.mapHref" maxlength="2048" class="w-full" /></UFormField>
    <UFormField label="Описание карты"><UInput v-model="page.mapTitle" maxlength="500" class="w-full" /></UFormField>
  </div></UCard>
  <AdminContactsSocialFields v-for="social in page.socials" :key="social.id" :social="social" @upload="(event, item) => emit('upload', event, item)" @remove="emit('remove', $event)" />
</template>
