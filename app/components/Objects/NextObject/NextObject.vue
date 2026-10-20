<script setup lang="ts">
import type { ServicesHelpCardSettings } from '#shared/types/services-help-card'
import { defaultObjectsNextObject } from '#shared/config/default-objects-next-object'
const {data:content}=await useFetch<ServicesHelpCardSettings>('/api/objects-next-object',{key:'site-objects-next-object',default:()=>structuredClone(defaultObjectsNextObject)})
const emit=defineEmits<{request:[]}>()
</script>
<template><SharedContactCard :content="content" heading-id="objects-next-object-title" @request="emit('request')" /></template>
