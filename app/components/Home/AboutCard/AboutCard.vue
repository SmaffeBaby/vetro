<script setup lang="ts">
const { data: about } = await useAboutCard()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <section id="about" aria-label="О компании" class="site-about-card mx-auto max-w-480 px-5 pb-16 tablet:px-8 tablet:pb-24 desktop:px-[4.95%] desktop:pb-32">
    <div class="grid gap-9 rounded-[20px] bg-site-ink px-6 py-9 text-white tablet:grid-cols-2 tablet:gap-10 tablet:p-10 desktop:min-h-[314px] desktop:grid-cols-[1.15fr_0.95fr_1fr] desktop:gap-[clamp(28px,3.125vw,60px)] desktop:p-[clamp(32px,3.125vw,60px)]">
      <AboutCardLeftText v-if="about.leftItems.length" :items="about.leftItems" />
      <AboutCardCenter :text="about.centerText" @request="emit('request')" />
      <AboutCardRightText v-if="about.rightItems.length" :items="about.rightItems" class="tablet:col-span-2 desktop:col-span-1" />
    </div>
  </section>
</template>

<style scoped>
.site-about-card { font-family: Montserrat, sans-serif; }
</style>
