<script setup lang="ts">
import type { ObjectsCatalog } from '#shared/types/objects'

const props = defineProps<{ currentServiceId: string }>()
const { data: catalog } = await useFetch<ObjectsCatalog>('/api/objects', { key: 'site-objects' })
const objects = computed(() => catalog.value?.objects.filter(object => object.serviceIds.includes(props.currentServiceId)) || [])
</script>

<template>
  <section v-if="objects.length" aria-labelledby="service-objects-title" class="mx-auto max-w-480 px-5 pb-16 text-site-ink tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pb-32">
    <h2 id="service-objects-title" class="text-[32px] font-bold leading-[1.1] tablet:text-[40px] desktop:text-[clamp(40px,2.9167vw,56px)]">Крупные объекты</h2>
    <ObjectsGrid :objects="objects" :button-label="catalog?.settings.buttonLabel" heading-tag="h3" class="mt-10 tablet:mt-14" />
  </section>
</template>
