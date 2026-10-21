<script setup lang="ts">
import type { NuxtError } from '#app'
import type { NotFoundSettings } from '#shared/types/not-found'
import { defaultNotFound } from '#shared/config/default-not-found'

const props = defineProps<{ error: NuxtError }>()
const { data: settings } = await useFetch<NotFoundSettings>('/api/not-found', {
  key: 'site-not-found', default: () => structuredClone(defaultNotFound), retry: 0
})
const code = computed(() => props.error.statusCode || 500)
const content = computed(() => code.value === 404 ? settings.value : {
  ...defaultNotFound, title: 'Не удалось загрузить страницу', text: 'Попробуйте вернуться на главную страницу или зайдите позже.'
})
useHead({ title: () => `${code.value} · ${content.value.title} · Ветро`, meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
const navigate = (href: string) => clearError({ redirect: href })
</script>

<template>
  <UApp><ErrorPage :content="content" :code="code" @navigate="navigate" /></UApp>
</template>
