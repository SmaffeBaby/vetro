<script setup lang="ts">
import { mediaUrl } from '#shared/utils/media'
import { footerYearText } from '#shared/utils/footer-code'
const props = defineProps<{ svg: string; path?: string | null; text: string; year: number }>()
const preview = useHeaderLogo(() => props.svg)
const src = computed(() => props.path ? mediaUrl(props.path) : preview.value)
</script>

<template>
  <div class="footer-brand min-w-0">
    <NuxtLink to="/" aria-label="Ветро — главная" class="inline-block max-w-full"><img v-if="svg" :src="src" alt="Ветро" width="200" height="37" class="block h-auto w-50 max-w-full"><span v-else class="text-xl font-bold">Ветро</span></NuxtLink>
    <p v-if="text" class="mt-2 max-w-72 whitespace-pre-line text-sm leading-[1.25] [overflow-wrap:anywhere]">{{ footerYearText(text, year) }}</p>
  </div>
</template>
