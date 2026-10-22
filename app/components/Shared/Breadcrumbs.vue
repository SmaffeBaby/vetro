<script setup lang="ts">
defineProps<{ items: { label:string; to?:string }[] }>()
</script>
<template>
 <nav aria-label="Хлебные крошки" class="relative z-10 text-sm leading-relaxed text-site-muted">
  <ol class="flex flex-wrap items-center gap-x-2 gap-y-1"><template v-for="(item,index) in items" :key="index"><li v-if="index" aria-hidden="true">/</li><li :aria-current="!item.to?'page':undefined" :class="!item.to?'text-site-ink [overflow-wrap:anywhere]':''"><NuxtLink v-if="item.to" :to="item.to" class="transition-colors hover:text-site-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-brand">{{ item.label }}</NuxtLink><span v-else>{{ item.label }}</span></li></template></ol>
 </nav>
</template>
