<script setup lang="ts">
import type {SiteObject} from '#shared/types/objects'
import {objectIdSchema} from '#shared/utils/objects'
definePageMeta({key:route=>route.path})
const id=String(useRoute().params.id)
if(!objectIdSchema.safeParse(id).success)throw createError({statusCode:404,statusMessage:'Объект не найден'})
const {data:object,error}=await useSiteQuery<SiteObject>(`/api/objects/${encodeURIComponent(id)}`,{})
if(error.value||!object.value)throw createError({statusCode:error.value?.statusCode||503,statusMessage:error.value?.statusCode===404?'Объект не найден':'Не удалось загрузить объект'})
useHead({title:()=>`${object.value?.title} · Ветро`,meta:[{name:'description',content:()=>object.value?.subtitle||object.value?.address||''}]})
</script>
<template><ObjectsDetail v-if="object" :object="object" /></template>
