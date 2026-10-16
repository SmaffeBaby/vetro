<script setup lang="ts">
import type { ServiceWhyUsCard } from '#shared/types/services-why-us'
defineProps<{ card: ServiceWhyUsCard; number: number }>()
</script>

<template>
  <li class="min-w-0 rounded-[28px] bg-white p-7 [overflow-wrap:anywhere] tablet:rounded-[40px] tablet:p-10 desktop:min-h-[270px] desktop:p-12">
    <span aria-hidden="true" class="block w-fit bg-gradient-to-r from-[#2a9ccf] to-[#7bd3ef] bg-clip-text text-[44px] font-bold leading-[1.1] text-transparent tablet:text-[52px] desktop:text-[56px]">{{ String(number).padStart(2, '0') }}</span>
    <p class="mt-8 whitespace-pre-line text-base font-semibold leading-[1.25] desktop:mt-10 desktop:text-xl">{{ card.description }}</p>
  </li>
</template>
