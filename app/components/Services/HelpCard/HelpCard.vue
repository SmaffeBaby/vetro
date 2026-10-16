<script setup lang="ts">
const { data: help } = await useServicesHelpCard()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <section aria-labelledby="services-help-card-title" class="help-card grid min-w-0 items-center gap-10 rounded-[28px] bg-[#203b5c] p-7 text-white tablet:rounded-[40px] tablet:p-10 desktop:gap-20 desktop:px-[4.1%] desktop:py-16" :class="help.svg ? 'desktop:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]' : ''">
    <ServicesHelpCardContent :title="help.title" :text="help.text" :button-label="help.buttonLabel" @request="emit('request')" />
    <ServicesHelpCardImage v-if="help.svg" :svg="help.svg" :path="help.imagePath" />
  </section>
</template>
