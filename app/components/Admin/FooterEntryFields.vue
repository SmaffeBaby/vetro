<script setup lang="ts">
import type { FooterEntry } from '#shared/types/footer'
defineProps<{ item: FooterEntry; label: string }>()
const modes = [{ label: 'Текст', value: 'text' as const }, { label: 'Ссылка', value: 'link' as const }, { label: 'HTML-код', value: 'code' as const }]
</script>

<template>
  <div class="space-y-4">
      <UFormField :label="`Формат: ${label}`"><USelect v-model="item.mode" :items="modes" :aria-label="`Формат: ${label}`" class="w-full tablet:max-w-60" /></UFormField>
      <template v-if="item.mode !== 'code'">
        <UFormField :label="`Текст: ${label}`"><UTextarea v-model="item.text" :aria-label="`Текст: ${label}`" maxlength="2000" :rows="2" class="w-full" /></UFormField>
        <template v-if="item.mode === 'link'">
          <UFormField :label="`Ссылка: ${label}`" description="Путь /page, #anchor, https://, mailto: или tel:."><UInput v-model="item.href" :aria-label="`Ссылка: ${label}`" maxlength="2048" placeholder="https://example.ru/" class="w-full" /></UFormField>
          <UFormField :label="`Выделяемое слово: ${label}`" description="Если заполнено, только эта часть текста станет голубой ссылкой. Например: Light."><UInput v-model="item.highlight" :aria-label="`Выделяемое слово: ${label}`" maxlength="200" class="w-full" /></UFormField>
        </template>
      </template>
      <UFormField v-if="item.mode === 'code'" :label="`HTML-код: ${label}`" description="Теги a, span, strong, b, em, i, u, br, p, ul, ol, li. Ссылки — через href; перенос — через br."><UTextarea v-model="item.code" :aria-label="`HTML-код: ${label}`" maxlength="10000" :rows="4" class="w-full" :ui="{ base: 'font-mono text-xs' }" /></UFormField>
  </div>
</template>
