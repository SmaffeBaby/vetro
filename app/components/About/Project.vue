<script setup lang="ts">
import type { ServicesHelpCardSettings } from '#shared/types/services-help-card'
import { defaultAboutProject } from '#shared/config/default-about-project'
const { data: content } = await useSiteQuery<ServicesHelpCardSettings>('/api/about-project', { default: () => structuredClone(defaultAboutProject) })
</script>

<template>
  <SharedContactCard :content="content" heading-id="about-project-title" variant="centered" class="about-project mt-16 tablet:mt-20" @request="navigateTo('/contacts#write-us')" />
</template>
