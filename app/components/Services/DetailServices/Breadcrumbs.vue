<script setup lang="ts">
defineProps<{label:string}>()
</script>
<template><SharedBreadcrumbs :items="[{label:'Главная',to:'/'},{label:'Услуги',to:'/services'},{label}]" /></template>
