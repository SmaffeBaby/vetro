<script setup lang="ts">
import type { WorkCard } from '#shared/types/how-work'
defineProps<{ card: WorkCard; number: number; active: boolean }>()
const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <li class="work-card min-w-0" :data-active="active" @click="emit('select')">
    <h3><button :id="`work-trigger-${card.id}`" type="button" :aria-expanded="active" :aria-controls="`work-text-${card.id}`" class="work-trigger flex w-full items-start text-left font-bold leading-[1.4]" @click.stop="emit('select')"><span aria-hidden="true" class="work-number flex shrink-0 items-center justify-center rounded-full border-2 font-bold leading-none">{{ number }}</span><span class="work-title min-w-0 whitespace-pre-line [overflow-wrap:anywhere]">{{ card.title }}</span></button></h3>
    <div :id="`work-text-${card.id}`" role="region" :aria-labelledby="`work-trigger-${card.id}`" :aria-hidden="!active" :inert="!active" class="work-description">
      <div class="min-h-0 overflow-hidden"><p class="whitespace-pre-line pt-6 text-base font-medium leading-[1.25] [overflow-wrap:anywhere]">{{ card.text }}</p></div>
    </div>
  </li>
</template>

<style scoped>
@reference "../../assets/css/main.css";
.work-card { --counter: clamp(40px, 2.916667vw, 56px); --card-gap: clamp(12px, 1.25vw, 24px); padding: clamp(20px, 1.458333vw, 28px); border-radius: 12px; cursor: pointer; transition: flex-grow 420ms ease, box-shadow 300ms ease; }
.work-card[data-active="true"] { box-shadow: 0 0 0 2px #ededed; }
.work-trigger { gap: var(--card-gap); }
.work-trigger:focus-visible { outline: 2px solid #2a9ccf; outline-offset: 6px; border-radius: 4px; }
.work-title { font-size: clamp(16px, 1.041667vw, 20px); }
.work-number { width: var(--counter); height: var(--counter); color: #94a3b8; border-color: #b9cefc; background: #f5f6f8; font-size: clamp(24px, 1.666667vw, 32px); transition: color 300ms ease, background-color 300ms ease, border-color 300ms ease; }
.work-card[data-active="true"] .work-number { color: white; border-color: #2a9ccf; background: #2a9ccf; }
.work-description { display: grid; grid-template-rows: 0fr; opacity: 0; transform: translateY(8px); margin-left: calc(var(--counter) + var(--card-gap)); transition: grid-template-rows 380ms ease, opacity 300ms ease, transform 380ms ease; }
.work-card[data-active="true"] .work-description { grid-template-rows: 1fr; opacity: 1; transform: translateY(0); }
@variant desktop {
  .work-card { flex: 1 1 0%; min-height: 264px; }
  .work-card[data-active="true"] { flex-grow: 1.4; }
}
@media (min-width: 1200px) and (max-width: 1599px) {
  .work-trigger { flex-direction: column; }
  .work-description { margin-left: 0; }
}
@media (prefers-reduced-motion: reduce) { .work-card, .work-number, .work-description { transition: none; transform: none; } }
</style>
