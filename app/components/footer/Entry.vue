<script setup lang="ts">
import type { FooterEntry } from '#shared/types/footer'
import { footerYearText, footerLinkParts } from '#shared/utils/footer-code'
const props = defineProps<{ item: FooterEntry; year: number }>()
const parts = computed(() => footerLinkParts(props.item.text, props.item.highlight))
const external = computed(() => /^https?:\/\//i.test(props.item.href))
</script>

<template>
  <div class="min-w-0 whitespace-pre-line [overflow-wrap:anywhere]">
    <FooterCode v-if="item.mode === 'code'" :code="item.code" :year="year" />
    <template v-else-if="item.mode === 'link' && parts">{{ footerYearText(parts.before, year) }}<a :href="item.href" :target="external ? '_blank' : undefined" :rel="external ? 'noopener noreferrer' : undefined" class="text-[#2a9ccf] hover:underline">{{ footerYearText(parts.word, year) }}</a>{{ footerYearText(parts.after, year) }}</template>
    <a v-else-if="item.mode === 'link'" :href="item.href" :target="external ? '_blank' : undefined" :rel="external ? 'noopener noreferrer' : undefined" class="transition-colors hover:text-[#2a9ccf]">{{ footerYearText(item.text, year) }}</a>
    <span v-else>{{ footerYearText(item.text, year) }}</span>
  </div>
</template>
