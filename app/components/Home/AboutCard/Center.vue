<script setup lang="ts">
defineProps<{ text: string }>()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <div class="min-w-0">
    <p class="whitespace-pre-line text-lg font-bold leading-[1.35] [overflow-wrap:anywhere]">{{ text }}</p>
    <AboutCardButton class="mt-8 tablet:mt-12" @click="emit('request')" />
  </div>
</template>
