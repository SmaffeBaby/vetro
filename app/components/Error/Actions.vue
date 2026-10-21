<script setup lang="ts">
defineProps<{ primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string }>()
const emit = defineEmits<{ navigate: [href: string] }>()
</script>

<template>
  <div class="mt-8 flex flex-wrap gap-3">
    <a :href="primaryHref" class="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#2a9ccf] px-7 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#2184b0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]" @click.prevent="emit('navigate', primaryHref)">{{ primaryLabel }}</a>
    <a :href="secondaryHref" class="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#d0d5dd] bg-white px-7 py-3 text-sm font-semibold text-[#203e63] transition-colors hover:bg-[#eaf6fc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]" @click.prevent="emit('navigate', secondaryHref)">{{ secondaryLabel }}</a>
  </div>
</template>
