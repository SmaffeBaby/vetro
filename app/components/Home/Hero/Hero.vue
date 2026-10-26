<script setup lang="ts">
const { data: hero } = await useHero()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <section class="site-hero mx-auto grid max-w-480 items-center gap-8 px-5 py-10 text-site-ink tablet:px-8 tablet:py-14 desktop:min-h-[620px] desktop:grid-cols-[42%_58%] desktop:gap-0 desktop:py-0 desktop:pl-[4.95%] desktop:pr-0" aria-labelledby="hero-title" :class="{ 'hero-without-image': !hero.imagePath }">
    <div class="relative z-10 min-w-0 desktop:py-20">
      <HeroTitle :title="hero.title" :accent-title="hero.accentTitle" :text="hero.text" :regalia="hero.regalia" />
      <div class="hero-actions mt-9 flex flex-wrap gap-4 tablet:mt-14 tablet:gap-9">
        <HeroButton :label="hero.primaryButtonLabel" @click="emit('request')" />
        <HeroButton :label="hero.secondaryButtonLabel" secondary href="/services" />
      </div>
    </div>
    <HeroImage v-if="hero.imagePath" :path="hero.imagePath" alt="Инженерные системы здания" />
  </section>
</template>

<style scoped>
.site-hero { font-family: Montserrat, sans-serif; }
.site-hero :deep(.hero-title) { font-size: clamp(30px, 3.125vw, 60px); line-height: 1.12; overflow-wrap: anywhere; }
.site-hero :deep(.hero-regalia) { font-size: clamp(15px, 1.25vw, 24px); }
.site-hero :deep(.hero-button:focus-visible) { outline: 2px solid var(--color-site-brand); outline-offset: 5px; }
.hero-without-image { grid-template-columns: 1fr; padding-right: 4.95%; }
@media (max-width: 767px) {
  .site-hero { gap: 64px; padding: 40px 10px 32px; }
  .site-hero :deep(.hero-image) { grid-row: 1; }
  .site-hero :deep(.hero-title) { font-size: 32px; line-height: 1.1; white-space: normal; overflow-wrap: normal; }
  .site-hero :deep(.hero-title > .text-site-brand) { display: inline; }
  .site-hero :deep(.hero-title > .text-site-brand)::before { content: ' '; }
  .site-hero :deep(.hero-regalia) { margin-top: 20px; font-size: 18px; gap: 4px 10px; }
  .site-hero :deep(.hero-regalia > li) { display: contents; }
  .hero-actions { margin-top: 32px; gap: 10px; }
  .site-hero :deep(.hero-button) { width: 100%; }
}
</style>
