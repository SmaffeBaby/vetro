<script setup lang="ts">
import type { ServicesHelpCardSettings } from '#shared/types/services-help-card'
defineProps<{ content: ServicesHelpCardSettings; headingId: string }>()
const emit=defineEmits<{request:[]}>()
</script>
<template>
  <section :aria-labelledby="headingId" class="help-card grid min-w-0 items-center gap-10 rounded-[28px] bg-[#203b5c] p-7 text-white tablet:rounded-[40px] tablet:p-10 desktop:gap-20 desktop:px-[4.1%] desktop:py-16" :class="content.svg ? 'desktop:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]' : ''">
    <ServicesHelpCardContent :heading-id="headingId" :title="content.title" :text="content.text" :button-label="content.buttonLabel" @request="emit('request')" />
    <ServicesHelpCardImage v-if="content.svg" :svg="content.svg" :path="content.imagePath" />
  </section>
</template>
