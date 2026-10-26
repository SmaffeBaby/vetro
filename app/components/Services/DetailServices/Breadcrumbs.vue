<script setup lang="ts">
defineProps<{label:string}>()
</script>
<template><NuxtLink to="/services" class="detail-back inline-flex items-center gap-2 font-semibold text-site-charcoal tablet:hidden"><UIcon name="i-lucide-chevron-left" aria-hidden="true" class="size-4 text-site-ink" />Назад</NuxtLink><SharedBreadcrumbs class="hidden tablet:block" :items="[{label:'Главная',to:'/'},{label:'Услуги',to:'/services'},{label}]" /></template>
