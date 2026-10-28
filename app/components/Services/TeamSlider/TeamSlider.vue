<script setup lang="ts">
import type { ServicesTeamSettings } from '#shared/types/services-team'
import { defaultServicesTeam } from '#shared/config/default-services-team'
import { sortTeamCards } from '#shared/utils/services-team'
withDefaults(defineProps<{ embedded?: boolean; title?: string; description?: string; regionId?: string }>(), { embedded: false, regionId: 'services-team-title' })
const { data: team } = await useSiteQuery<ServicesTeamSettings>('/api/services-team', { default: () => structuredClone(defaultServicesTeam) })
const cards = computed(() => sortTeamCards(team.value.cards))
</script>
<template>
 <section v-if="cards.length" :aria-labelledby="regionId" class="services-team min-w-0 text-site-ink" :class="embedded ? '' : 'mx-auto max-w-480 px-5 pb-16 tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pb-32'">
  <SharedCardSlider :items="cards" :title="title ?? team.title" :description="description ?? team.description" :region-id="regionId" item-class="basis-[85%] ps-5 tablet:basis-1/2 desktop:basis-1/4" previous-label="Предыдущие сотрудники" next-label="Следующие сотрудники"><template #default="{item}"><ServicesTeamSliderCard :card="item" /></template></SharedCardSlider>
 </section>
</template>
