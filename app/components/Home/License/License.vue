<script setup lang="ts">
import { mediaUrl } from '#shared/utils/media.ts'
const { data: license } = await useLicense()
</script>

<template>
  <section id="licenses" aria-labelledby="license-title" class="site-license min-w-0 rounded-[20px] bg-[#f5f6f8] p-6 text-[#203e63] tablet:p-10 desktop:p-12">
    <h2 id="license-title" class="text-[28px] font-bold leading-tight tablet:text-[32px]">Лицензии и сертификаты</h2>
    <div class="mt-9 grid items-center gap-7 tablet:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] desktop:gap-6">
      <a v-if="license.imagePath" :href="mediaUrl(license.imagePath)" target="_blank" rel="noopener noreferrer" aria-label="Открыть фото лицензии в полном размере" class="block min-w-0"><img :src="mediaUrl(license.imagePath)" :alt="license.title" width="248" height="360" class="mx-auto block max-h-90 w-full rounded-lg object-contain"></a>
      <div v-else class="flex aspect-[248/360] max-h-90 min-w-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/60 p-5 text-center text-sm text-slate-500"><div><UIcon name="i-lucide-file-badge" class="mb-3 size-10 text-[#2a9ccf]" /><p>Лицензия</p></div></div>
      <div class="min-w-0"><h3 class="whitespace-pre-line text-xl font-bold leading-relaxed desktop:text-[clamp(16px,1.041667vw,20px)] [overflow-wrap:anywhere]">{{ license.title }}</h3><a href="/public#contacts" class="mt-8 inline-flex min-h-14 w-full max-w-[196px] items-center justify-center rounded-lg border border-[#2a9ccf] px-2 py-3 text-center text-sm tablet:text-base desktop:text-[clamp(14px,0.833333vw,16px)] font-semibold text-[#2a9ccf] transition-colors hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf] [overflow-wrap:anywhere]">{{ license.buttonLabel }}</a></div>
    </div>
  </section>
</template>

<style scoped>
.site-license { font-family: Montserrat, sans-serif; }
</style>
