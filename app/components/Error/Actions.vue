<script setup lang="ts">
defineProps<{ primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string }>()
const emit = defineEmits<{ navigate: [href: string] }>()
</script>

<template>
  <div class="mt-8 flex flex-wrap gap-3">
    <a :href="primaryHref" class="inline-flex min-h-12 items-center justify-center rounded-lg bg-site-brand px-7 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-site-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-brand" @click.prevent="emit('navigate', primaryHref)">{{ primaryLabel }}</a>
    <a :href="secondaryHref" class="inline-flex min-h-12 items-center justify-center rounded-lg border border-site-line bg-white px-7 py-3 text-sm font-semibold text-site-ink transition-colors hover:bg-site-brand-tint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-brand" @click.prevent="emit('navigate', secondaryHref)">{{ secondaryLabel }}</a>
  </div>
</template>
