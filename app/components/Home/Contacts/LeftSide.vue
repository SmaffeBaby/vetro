<script setup lang="ts">
import type { ContactItem } from '#shared/types/contacts.ts'
import { mediaUrl } from '#shared/utils/media.ts'
defineProps<{ items: ContactItem[] }>()
const year = useFooterYear()
const emit = defineEmits<{ request: [] }>()
const iconSrc = (item: ContactItem) => item.iconPath ? mediaUrl(item.iconPath) : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.svg)}`
</script>

<template>
  <div class="min-w-0 px-6 py-8 tablet:p-10">
    <h2 id="contacts-title" class="mb-8 text-[30px] font-bold uppercase leading-tight">Контакты</h2>
    <ul class="space-y-5 tablet:space-y-8">
      <li v-for="item in items" :key="item.id" class="flex items-start gap-6">
        <div v-if="item.svg" class="flex size-14 shrink-0 items-center justify-center rounded-full bg-site-brand-tint"><img :src="iconSrc(item)" alt="" aria-hidden="true" width="32" height="32" class="block size-8 object-contain"></div>
        <div class="min-w-0"><h3 class="mb-1 whitespace-pre-line text-xl font-bold leading-tight [overflow-wrap:anywhere]">{{ item.title }}</h3><FooterEntry :item="item" :year="year" class="text-base leading-[1.4]" /></div>
      </li>
    </ul>
    <AboutCardButton class="contacts-cta mt-8" @click="emit('request')" />
  </div>
</template>

<style scoped>
.contacts-cta { width: 100%; max-width: 352px; min-height: 70px; }
:deep(.footer-code a) { text-decoration: underline; text-underline-offset: 3px; }
</style>
