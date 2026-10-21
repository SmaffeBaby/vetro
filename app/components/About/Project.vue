<script setup lang="ts">
import type { ServicesHelpCardSettings } from '#shared/types/services-help-card'
import { defaultAboutProject } from '#shared/config/default-about-project'
const { data: content } = await useFetch<ServicesHelpCardSettings>('/api/about-project', { key: 'site-about-project', default: () => structuredClone(defaultAboutProject) })
</script>

<template>
  <SharedContactCard :content="content" heading-id="about-project-title" variant="centered" class="mt-16 tablet:mt-20" @request="navigateTo('/contacts#write-us')" />
</template>
