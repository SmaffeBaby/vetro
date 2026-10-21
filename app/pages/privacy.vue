<script setup lang="ts">
import type { PrivacySettings } from '#shared/types/privacy'
import { defaultPrivacy } from '#shared/config/default-privacy'
const { data: content } = await useFetch<PrivacySettings>('/api/privacy', { key: 'site-privacy', default: () => structuredClone(defaultPrivacy) })
useHead({ title: () => `${content.value.title} · Ветро` })
</script>

<template>
  <div class="privacy-page min-h-screen bg-[#f7f8fa] text-[#203e63]">
    <Header @request="navigateTo('/contacts#write-us')" />
    <main class="mx-auto max-w-480 px-5 pb-16 pt-6 tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pt-10">
      <SharedBreadcrumbs :items="[{ label: 'Главная', to: '/' }, { label: content.breadcrumb }]" />
      <h1 class="mt-8 whitespace-pre-line text-[30px] font-bold leading-tight [overflow-wrap:anywhere] tablet:text-5xl desktop:text-[60px]">{{ content.title }}</h1>
      <p v-if="content.intro" class="mt-6 whitespace-pre-line text-lg leading-relaxed [overflow-wrap:anywhere]">{{ content.intro }}</p>
      <PrivacyDocument :content="content" />
    </main>
    <Footer @request="navigateTo('/contacts#write-us')" />
  </div>
</template>

<style scoped>
.privacy-page { font-family: Montserrat, sans-serif; }
.privacy-page :deep(.site-header), .privacy-page :deep(#header-navigation) { background-color: #f7f8fa; }
</style>
