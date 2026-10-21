<script setup lang="ts">
import type { WhyCard } from '#shared/types/why.ts'
import { mediaUrl } from '#shared/utils/media.ts'
withDefaults(defineProps<{ card: WhyCard; active: boolean; interactive?: boolean }>(), { interactive: true })
const emit = defineEmits<{ select: [] }>()
const iconSrc = (card: WhyCard) => card.iconPath ? mediaUrl(card.iconPath) : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(card.svg)}`
</script>

<template>
  <li class="why-card min-w-0" :data-active="active" @pointerenter="interactive && $event.pointerType !== 'touch' && emit('select')" @focusin="interactive && emit('select')">
    <h3><component :is="interactive ? 'button' : 'span'" :id="`why-trigger-${card.id}`" :type="interactive ? 'button' : undefined" :aria-expanded="interactive ? active : undefined" :aria-controls="interactive ? `why-text-${card.id}` : undefined" class="why-trigger w-full text-left font-bold leading-[1.4]">
      <span aria-hidden="true" class="why-icon flex items-center justify-center rounded-full bg-[#2a9ccf]"><img v-if="card.svg" :src="iconSrc(card)" alt="" width="32" height="32" class="size-8 object-contain"></span>
      <span class="why-title block min-w-0 whitespace-pre-line [overflow-wrap:anywhere]">{{ card.title }}</span>
    </component></h3>
    <div :id="`why-text-${card.id}`" role="region" :aria-labelledby="`why-trigger-${card.id}`" :aria-hidden="!active" :inert="!active" class="why-description">
      <div class="min-h-0 overflow-hidden"><ul class="space-y-4 pt-6"><li v-for="(point, index) in card.points" :key="index" class="relative pl-4 text-base font-semibold leading-[1.45] before:absolute before:left-0 before:top-[0.6em] before:size-[5px] before:rounded-full before:bg-[#2a9ccf]"><span class="whitespace-pre-line [overflow-wrap:anywhere]">{{ point }}</span></li></ul></div>
    </div>
    <WhyDivider />
  </li>
</template>

<style scoped>
@reference "../../../assets/css/main.css";
.why-card { --icon: 54px; --gap: 22px; position: relative; cursor: pointer; padding: 24px 0; transition: flex-grow 420ms ease; }
.why-trigger { display: grid; grid-template-columns: var(--icon) minmax(0, 1fr); gap: var(--gap); align-items: start; }
.why-icon { width: var(--icon); height: var(--icon); }
.why-title { font-size: clamp(17px, 1.041667vw, 20px); }
.why-trigger:focus-visible { outline: 2px solid #2a9ccf; outline-offset: 6px; border-radius: 4px; }
.why-description { display: grid; grid-template-rows: 0fr; opacity: 0; transform: translateY(8px); margin-left: calc(var(--icon) + var(--gap) - 16px); transition: grid-template-rows 380ms ease, opacity 300ms ease, transform 380ms ease; }
.why-card[data-active="true"] .why-description { grid-template-rows: 1fr; opacity: 1; transform: translateY(0); }
.why-card:last-child :deep(.why-divider) { display: none; }
@media (max-width: 1199px), (hover: none), (pointer: coarse) {
  .why-card, .why-trigger { cursor: default; }
  .why-description { transition: none; }
}
@variant desktop {
  .why-card { flex: 1 1 0%; padding: 0 clamp(22px, 3.75vw, 72px); min-height: 240px; --gap: clamp(16px, 1.15vw, 22px); }
  .why-card:first-child { padding-left: 0; }
  .why-card:last-child { padding-right: 0; }
  .why-card[data-active="true"] { flex-grow: 1.5; }
  .why-trigger { grid-template-columns: var(--icon) minmax(0,1fr); column-gap: 0; row-gap: 36px; }
  .why-title { grid-column: 1 / -1; }
  .why-card[data-active="true"] .why-trigger { column-gap: var(--gap); row-gap: 0; }
  .why-card[data-active="true"] .why-title { grid-column: 2; }
}
@media (min-width: 1200px) and (max-width: 1599px) {
  .why-card { padding-inline: 22px; --icon: 48px; }
  .why-card[data-active="true"] .why-trigger { row-gap: 20px; column-gap: 0; }
  .why-card[data-active="true"] .why-title { grid-column: 1 / -1; }
  .why-description { margin-left: -16px; }
}
@media (prefers-reduced-motion: reduce) { .why-card, .why-description { transition: none; transform: none; } }
</style>
