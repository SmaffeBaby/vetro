<script setup lang="ts">
import type { WorkCard } from '#shared/types/how-work.ts'
withDefaults(defineProps<{ card: WorkCard; number: number; active: boolean; interactive?: boolean }>(), { interactive: true })
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <li class="work-card min-w-0" :data-active="active">
    <h3><component :is="interactive ? 'button' : 'span'" :id="`work-trigger-${card.id}`" :type="interactive ? 'button' : undefined" :aria-expanded="interactive ? active : undefined" :aria-controls="interactive ? `work-text-${card.id}` : undefined" @click="emit('toggle')" class="work-trigger flex w-full items-start text-left font-bold leading-[1.4]"><span aria-hidden="true" class="work-number flex shrink-0 items-center justify-center rounded-full border-2 font-bold leading-none">{{ number }}</span><span class="work-title min-w-0 whitespace-pre-line [overflow-wrap:anywhere]">{{ card.title }}</span><UIcon name="i-lucide-chevron-down" aria-hidden="true" class="disclosure-chevron ml-auto size-4 shrink-0 desktop:hidden" :class="{ 'rotate-180': active }" /></component></h3>
    <div :id="`work-text-${card.id}`" role="region" :aria-labelledby="`work-trigger-${card.id}`" :aria-hidden="!active" :inert="!active" class="work-description">
      <div class="min-h-0 overflow-hidden"><p class="whitespace-pre-line pt-6 text-base font-medium leading-[1.25] [overflow-wrap:anywhere]">{{ card.text }}</p></div>
    </div>
  </li>
</template>

<style scoped>
@reference "../../../assets/css/main.css";
.work-card { --counter: clamp(40px, 2.916667vw, 56px); --card-gap: clamp(12px, 1.25vw, 24px); padding: clamp(20px, 1.458333vw, 28px); border-radius: 12px; cursor: pointer; transition: flex-grow 420ms ease, box-shadow 300ms ease; }
.work-card[data-active="true"] { box-shadow: 0 0 0 2px var(--color-site-line); }
.work-trigger { gap: var(--card-gap); }
.work-trigger:focus-visible { outline: 2px solid var(--color-site-brand); outline-offset: 6px; border-radius: 4px; }
.work-title { font-size: clamp(16px, 1.041667vw, 20px); }
.work-number { width: var(--counter); height: var(--counter); color: var(--color-site-muted); border-color: var(--color-site-brand-border); background: var(--color-site-surface); font-size: clamp(24px, 1.666667vw, 32px); transition: color 300ms ease, background-color 300ms ease, border-color 300ms ease; }
.work-card[data-active="true"] .work-number { color: white; border-color: var(--color-site-brand); background: var(--color-site-brand); }
.work-description { display: grid; grid-template-rows: 0fr; opacity: 0; transform: translateY(8px); margin-left: calc(var(--counter) + var(--card-gap)); transition: grid-template-rows 380ms ease, opacity 300ms ease, transform 380ms ease; }
.work-card[data-active="true"] .work-description { grid-template-rows: 1fr; opacity: 1; transform: translateY(0); }
@media (max-width: 1199px), (hover: none), (pointer: coarse) {
  .work-card, .work-trigger { cursor: default; }
  .work-description { transition: none; }
}
@variant desktop {
  .work-card { flex: 1 1 0%; min-height: 264px; }
  .work-card[data-active="true"] { flex-grow: 1.4; }
}
@media (min-width: 1200px) and (max-width: 1599px) {
  .work-trigger { flex-direction: column; }
  .work-description { margin-left: 0; }
}
@media (prefers-reduced-motion: reduce) { .work-card, .work-number, .work-description { transition: none; transform: none; } }

@media (max-width: 1199px) {
  .work-card { --counter: 56px; --card-gap: 10px; padding: 16px; border: 2px solid var(--color-site-line); }
  .work-card[data-active="true"] { box-shadow: none; }
  .work-trigger { align-items: center; cursor: pointer; }
  .work-title { font-size: 20px; }
  .work-number { background: var(--color-site-brand); border-color: var(--color-site-brand); color: white; font-size: 32px; }
  .work-description { margin-left: 0; transition: grid-template-rows 300ms ease, opacity 250ms ease, transform 300ms ease; }
  .work-description p { padding-top: 12px; }
}
.disclosure-chevron { transition: transform 250ms ease; }
@media (prefers-reduced-motion: reduce) { .work-description, .disclosure-chevron { transition: none; } }
</style>
