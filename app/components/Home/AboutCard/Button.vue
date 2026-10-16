<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Написать нам' })
</script>

<template>
  <HeaderButton :label="label" class="about-card-button max-w-full" />
</template>
