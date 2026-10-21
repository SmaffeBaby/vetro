<script setup lang="ts">
import type { ContactSocial } from '#shared/types/contacts'
defineProps<{ social: ContactSocial }>()
const emit = defineEmits<{ upload: [event: Event, social: ContactSocial]; remove: [social: ContactSocial] }>()
const preview = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
</script>

<template>
  <UCard><template #header><h2 class="font-semibold">{{ social.id === 'telegram' ? 'Telegram' : 'WhatsApp' }}</h2></template><div class="space-y-5">
    <UFormField label="Название мессенджера"><UInput v-model="social.title" maxlength="80" class="w-full" /></UFormField>
    <UFormField label="Ссылка на мессенджер" description="Можно оставить пустой: иконка будет показана без ссылки."><UInput v-model="social.href" maxlength="2048" placeholder="https://" class="w-full" /></UFormField>
    <div class="grid gap-5 tablet:grid-cols-[1fr_120px]"><UFormField :label="`SVG: ${social.title}`"><UTextarea v-model="social.svg" :rows="4" class="w-full" :ui="{ base: 'font-mono text-xs' }" /></UFormField><div class="flex items-center justify-center rounded-xl bg-slate-50 p-4"><img v-if="social.svg" :src="preview(social.svg)" :alt="social.title" class="size-10 object-contain" /></div></div>
    <div class="flex flex-wrap gap-3"><label class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><UIcon name="i-lucide-upload" class="size-4" />Загрузить SVG<input type="file" accept="image/svg+xml,.svg" :aria-label="`Загрузить SVG: ${social.title}`" class="sr-only" @change="emit('upload', $event, social)"></label><UButton label="Удалить SVG" color="error" variant="outline" :disabled="!social.svg" @click="emit('remove', social)" /></div>
  </div></UCard>
</template>
