<script setup lang="ts">
import type {ObjectResultCard} from '#shared/types/object-results'
defineProps<{card:ObjectResultCard}>()
</script>
<template><div class="flex min-w-0 flex-col [overflow-wrap:anywhere]"><dt class="order-2 mt-3 whitespace-pre-line text-base font-medium leading-[1.4]">{{card.text}}</dt><dd class="order-1 whitespace-pre-line text-[44px] font-bold leading-[1.1] text-site-brand tablet:text-[52px] desktop:text-[56px]">{{card.value}}</dd></div></template>
