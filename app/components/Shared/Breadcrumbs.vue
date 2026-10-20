<script setup lang="ts">
defineProps<{ items: { label:string; to?:string }[] }>()
</script>
<template>
 <nav aria-label="Хлебные крошки" class="relative z-10 text-sm leading-relaxed text-[#a6afbc]">
  <ol class="flex flex-wrap items-center gap-x-2 gap-y-1"><template v-for="(item,index) in items" :key="index"><li v-if="index" aria-hidden="true">/</li><li :aria-current="!item.to?'page':undefined" :class="!item.to?'text-[#647084] [overflow-wrap:anywhere]':''"><NuxtLink v-if="item.to" :to="item.to" class="transition-colors hover:text-[#203e63] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]">{{ item.label }}</NuxtLink><span v-else>{{ item.label }}</span></li></template></ol>
 </nav>
</template>
