<script setup lang="ts">
import type { SiteObject } from '#shared/types/objects'

withDefaults(defineProps<{
  objects: SiteObject[]
  buttonLabel?: string
  headingTag?: 'h2' | 'h3'
}>(), { buttonLabel: 'Подробнее', headingTag: 'h2' })
</script>

<template>
  <div class="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
    <ObjectsCard v-for="object in objects" :key="object.id" :object="object" :button-label="buttonLabel" :heading-tag="headingTag" />
  </div>
</template>
