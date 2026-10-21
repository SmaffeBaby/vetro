<script setup lang="ts">
import type { ContactSocial } from '#shared/types/contacts'
import { mediaUrl } from '#shared/utils/media'
defineProps<{ socials: ContactSocial[] }>()
const src = (social: ContactSocial) => social.iconPath ? mediaUrl(social.iconPath) : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(social.svg)}`
</script>

<template>
  <div class="flex flex-wrap items-center gap-8">
    <template v-for="social in socials" :key="social.id">
      <component :is="social.href ? 'a' : 'span'" v-if="social.svg" :href="social.href || undefined" :target="social.href ? '_blank' : undefined" :rel="social.href ? 'noopener noreferrer' : undefined" :aria-label="social.title" class="inline-flex size-11 items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]">
        <img :src="src(social)" :alt="social.title" width="40" height="40" class="size-10 object-contain" />
      </component>
    </template>
  </div>
</template>
