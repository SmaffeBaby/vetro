<script setup lang="ts">
import type { ServicesHelpCardSettings } from '#shared/types/services-help-card'
import { mediaUrl } from '#shared/utils/media'
withDefaults(defineProps<{ content: ServicesHelpCardSettings; headingId: string; variant?: 'split' | 'centered' }>(), { variant: 'split' })
const emit=defineEmits<{request:[]}>()
</script>
<template>
  <section :aria-labelledby="headingId" class="help-card relative grid min-w-0 items-center rounded-[28px] p-7 text-white tablet:rounded-[40px] tablet:p-10 desktop:px-[4.1%]" :class="variant === 'centered' ? 'isolate min-h-[400px] overflow-hidden bg-linear-to-r from-site-brand to-site-brand-light py-16 desktop:min-h-[min(46vw,800px)] desktop:py-24' : ['gap-10 bg-site-ink desktop:gap-20 desktop:py-16', content.svg ? 'desktop:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]' : '']">
    <img v-if="variant === 'centered' && content.svg" :src="content.imagePath ? mediaUrl(content.imagePath) : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(content.svg)}`" alt="" aria-hidden="true" class="help-card-background pointer-events-none absolute inset-0 h-full w-full object-cover" />
    <ServicesHelpCardContent :centered="variant === 'centered'" :heading-id="headingId" :title="content.title" :text="content.text" :button-label="content.buttonLabel" @request="emit('request')" />
    <ServicesHelpCardImage v-if="variant === 'split' && content.svg" :svg="content.svg" :path="content.imagePath" />
  </section>
</template>
