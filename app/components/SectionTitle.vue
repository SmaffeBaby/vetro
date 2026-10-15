<script setup lang="ts">
defineProps<{ id: string; text?: string }>()
</script>

<template>
  <div>
    <h2 :id="id" class="text-[28px] font-bold leading-none tablet:text-[32px] desktop:text-[clamp(26px,1.6667vw,32px)]"><slot>{{ text }}</slot></h2>
    <div class="mt-5 h-[3px] w-11 bg-[#2a9ccf]" aria-hidden="true" />
  </div>
</template>
