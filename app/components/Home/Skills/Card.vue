<script setup lang="ts">
import type { SkillCard } from '#shared/types/skills.ts'
const props = defineProps<{ card: SkillCard; active: boolean }>()
const icon = useSkillIcon(() => props.card)
</script>

<template>
  <article tabindex="0" role="listitem" :data-active="active" :aria-labelledby="`skill-title-${card.id}`" class="skill-card min-w-0 rounded-xl bg-white p-7 outline-offset-4 focus-visible:outline-2 focus-visible:outline-site-brand desktop:p-[clamp(16px,1.77vw,34px)]">
    <img :src="icon" alt="" aria-hidden="true" width="48" height="48" class="mb-5 block size-12 object-contain desktop:size-[clamp(36px,2.6vw,50px)]">
    <h3 :id="`skill-title-${card.id}`" class="skill-card-title whitespace-pre-line text-[18px] font-bold leading-[1.4]">{{ card.title }}</h3>
    <div class="skill-card-description">
      <div class="min-h-0 overflow-hidden"><p class="whitespace-pre-line pt-5 text-base font-medium leading-[1.25] desktop:text-[clamp(13px,0.8333vw,16px)]">{{ card.text }}</p></div>
    </div>
  </article>
</template>

<style scoped>
@reference "../../../assets/css/main.css";

.skill-card { transition: flex-grow 420ms ease; }
.skill-card-title { overflow-wrap: anywhere; hyphens: manual; }
.skill-card-description { display: grid; grid-template-rows: 1fr; opacity: 1; transform: translateY(0); transition: grid-template-rows 360ms ease, opacity 320ms ease, transform 360ms ease; }

@variant desktop {
  .skill-card { flex: 1 1 0%; min-height: clamp(244px, 15.3vw, 294px); }
  @media (hover: hover) and (pointer: fine) {
    .skill-card-description { grid-template-rows: 0fr; opacity: 0; transform: translateY(12px); }
    .skill-card[data-active="true"] { flex-grow: 1.42; }
    .skill-card[data-active="true"] .skill-card-description { grid-template-rows: 1fr; opacity: 1; transform: translateY(0); }
  }
}

@media (prefers-reduced-motion: reduce) {
  .skill-card, .skill-card-description { transition: none; transform: none; }
}
</style>
