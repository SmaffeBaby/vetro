<script setup lang="ts">
import type { ServiceCard } from '#shared/types/services'
defineProps<{ cards: ServiceCard[] }>()
</script>

<template>
  <ul aria-label="Услуги компании" class="services-cards grid gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
    <li v-for="(card, index) in cards" :key="card.id" class="service-card min-w-0 rounded-[32px] bg-white desktop:rounded-[40px]" :style="{ '--reveal-delay': `${Math.min(index, 5) * 75}ms` }">
      <ServicesCard :card="card" />
    </li>
  </ul>
</template>
