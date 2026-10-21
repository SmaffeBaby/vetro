<script setup lang="ts">
import type { ServiceIncludedSettings } from '#shared/types/services-included'
import { serviceIncludedHref } from '#shared/utils/services-included'

const props = defineProps<{ currentServiceId: string }>()
const { data: content } = await useFetch<ServiceIncludedSettings>(() => `/api/services-included/${encodeURIComponent(props.currentServiceId)}`, { key: `site-services-included-${props.currentServiceId}` })
</script>

<template>
  <section v-if="content?.items.length" aria-labelledby="service-included-title" class="bg-white py-16 tablet:py-24 desktop:py-28">
    <div class="mx-auto max-w-480 px-5 tablet:px-8 desktop:px-[4.95%]">
      <h2 id="service-included-title" class="text-[32px] font-bold leading-[1.1] tablet:text-[40px] desktop:text-[clamp(40px,2.9167vw,56px)]">{{ content.title }}</h2>
      <p v-if="content.text" class="mt-6 whitespace-pre-line text-lg leading-snug tablet:text-xl">{{ content.text }}</p>
      <div class="mt-10 grid grid-cols-1 gap-5 tablet:mt-16 tablet:grid-cols-2 desktop:grid-cols-4">
        <article v-for="item in content.items" :key="item.id" class="flex min-w-0 flex-col rounded-[32px] bg-[#f7f8fa] p-5 tablet:min-h-[400px] tablet:p-7">
          <h3 class="text-lg font-semibold leading-tight [overflow-wrap:anywhere]"><NuxtLink :to="serviceIncludedHref(currentServiceId, item.id)">{{ item.title }}</NuxtLink></h3>
          <p class="mt-3 whitespace-pre-line text-base leading-snug text-[#94a3b8] [overflow-wrap:anywhere]">{{ item.text }}</p>
          <div class="mt-auto pt-12"><NuxtLink :to="serviceIncludedHref(currentServiceId, item.id)" :aria-label="`${content.buttonLabel}: ${item.title}`" class="block rounded-2xl border border-[#2a9ccf] px-4 py-2 text-center text-sm font-semibold text-[#2a9ccf] transition-colors hover:bg-[#eaf6fc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]">{{ content.buttonLabel }}</NuxtLink></div>
        </article>
      </div>
    </div>
  </section>
</template>
