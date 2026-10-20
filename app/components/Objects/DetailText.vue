<script setup lang="ts">
defineProps<{title:string;subtitle:string;description:string}>()
</script>
<template><div><h1 class="whitespace-pre-line text-[34px] font-bold leading-[1.1] [overflow-wrap:anywhere] tablet:text-5xl desktop:text-[clamp(40px,3.125vw,60px)]">{{ title }}</h1><slot name="after-title" /><p v-if="subtitle" class="mt-6 whitespace-pre-line text-xl leading-snug text-[#94a3b8] tablet:text-2xl">{{ subtitle }}</p><p v-if="description" class="mt-10 whitespace-pre-line text-lg leading-[1.4] tablet:mt-14 tablet:text-2xl">{{ description }}</p></div></template>
