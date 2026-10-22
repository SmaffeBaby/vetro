<script setup lang="ts">
import type { SkillCard } from '#shared/types/skills.ts'
const props = defineProps<{ card: SkillCard; active: boolean }>()
const icon = useSkillIcon(() => props.card)
</script>

<template>
  <article tabindex="0" role="listitem" :data-active="active" :aria-labelledby="`skill-title-${card.id}`" class="skill-card min-w-0 rounded-xl border-2 border-site-line bg-white p-7 outline-offset-4 focus-visible:outline-2 focus-visible:outline-site-brand desktop:p-[clamp(18px,1.5625vw,30px)]">
    <img :src="icon" alt="" aria-hidden="true" width="48" height="48" class="mb-6 block size-12 object-contain">
    <h3 :id="`skill-title-${card.id}`" class="skill-card-title whitespace-pre-line text-xl font-bold leading-[1.4]">{{ card.title }}</h3>
    <div class="skill-card-description">
      <div class="min-h-0 overflow-hidden"><p class="pt-5 text-base font-medium leading-[1.25] whitespace-pre-line">{{ card.text }}</p></div>
    </div>
  </article>
</template>

<style scoped>
@reference "../../../assets/css/main.css";

.skill-card { transition: flex-grow 420ms ease, border-color 250ms ease; }
.skill-card-title { overflow-wrap: anywhere; hyphens: manual; }
.skill-card-description { display: grid; grid-template-rows: 1fr; opacity: 1; transform: translateY(0); transition: grid-template-rows 360ms ease, opacity 320ms ease, transform 360ms ease; }

@variant desktop {
  .skill-card { flex: 1 1 0%; min-height: 292px; }
  .skill-card-title { font-size: clamp(16px, 1.041667vw, 20px); }
  @media (hover: hover) and (pointer: fine) {
    .skill-card-description { grid-template-rows: 0fr; opacity: 0; transform: translateY(12px); }
    .skill-card[data-active="true"] { flex-grow: 1.41; }
    .skill-card[data-active="true"] .skill-card-description { grid-template-rows: 1fr; opacity: 1; transform: translateY(0); }
  }
}

@media (prefers-reduced-motion: reduce) {
  .skill-card, .skill-card-description { transition: none; transform: none; }
}
</style>
