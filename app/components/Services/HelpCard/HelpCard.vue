<script setup lang="ts">
const { data: help } = await useServicesHelpCard()
const emit = defineEmits<{ request: [] }>()
</script>
<template><SharedContactCard :content="help" heading-id="services-help-card-title" @request="emit('request')" /></template>
