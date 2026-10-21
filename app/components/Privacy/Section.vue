<script setup lang="ts">
import type { PrivacySection } from '#shared/types/privacy'
import { privacySectionId } from '#shared/utils/privacy'
defineProps<{ section: PrivacySection; index: number }>()
</script>

<template>
  <section :id="privacySectionId(section.id)" data-privacy-section :aria-labelledby="`${privacySectionId(section.id)}-title`" class="scroll-mt-44 tablet:scroll-mt-52 desktop:scroll-mt-44">
    <h2 :id="`${privacySectionId(section.id)}-title`" class="text-lg font-bold leading-snug [overflow-wrap:anywhere] tablet:text-xl">{{ index + 1 }}. {{ section.title }}</h2>
    <p class="mt-4 whitespace-pre-line text-base font-medium leading-relaxed [overflow-wrap:anywhere] tablet:text-xl">{{ section.text }}</p>
  </section>
</template>
