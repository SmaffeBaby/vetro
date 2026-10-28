<script setup lang="ts">
import type { ServicesHelpCardSettings } from '#shared/types/services-help-card'
import { defaultObjectsRequestCard } from '#shared/config/default-objects-request-card'
const {data:content}=await useSiteQuery<ServicesHelpCardSettings>('/api/objects-request-card',{default:()=>structuredClone(defaultObjectsRequestCard)})
const emit=defineEmits<{request:[]}>()
</script>
<template><SharedContactCard class="object-request" :content="content" heading-id="objects-request-card-title" @request="emit('request')" /></template>
