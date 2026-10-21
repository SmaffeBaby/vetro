<script setup lang="ts">
import type { NotFoundSettings } from '#shared/types/not-found'
withDefaults(defineProps<{ content: NotFoundSettings; code?: number }>(), { code: 404 })
const emit = defineEmits<{ navigate: [href: string] }>()
</script>

<template>
  <main class="error-page relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-[#f7f8fa] text-[#203e63]" aria-labelledby="error-title">
    <ErrorBackground v-if="content.showLogo" />
    <div class="relative z-10 mx-auto w-full max-w-480 px-5 pb-40 pt-16 tablet:px-8 tablet:pb-52 tablet:pt-24 desktop:px-[11%] desktop:pb-[max(200px,16vh)] desktop:pt-[max(100px,16vh)]">
      <p class="text-[clamp(120px,16vw,240px)] font-bold leading-none tracking-tight" aria-label="Код ошибки">{{ code }}</p>
      <h1 id="error-title" class="mt-10 whitespace-pre-line text-[28px] font-bold leading-tight [overflow-wrap:anywhere] tablet:mt-14 tablet:text-4xl">{{ content.title }}</h1>
      <p class="mt-6 max-w-5xl whitespace-pre-line text-lg leading-relaxed [overflow-wrap:anywhere] tablet:text-[22px]">{{ content.text }}</p>
      <ErrorActions :primary-label="content.primaryLabel" :primary-href="content.primaryHref" :secondary-label="content.secondaryLabel" :secondary-href="content.secondaryHref" @navigate="emit('navigate', $event)" />
    </div>
  </main>
</template>

<style scoped>
.error-page { font-family: Montserrat, sans-serif; }
</style>
