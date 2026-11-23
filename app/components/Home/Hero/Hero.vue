<script setup lang="ts">
const { data: hero } = await useHero()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <section class="site-hero relative grid items-center gap-8 px-5 py-10 text-site-ink tablet:px-8 tablet:py-14 desktop:gap-0 desktop:px-[4.95%] desktop:py-16" aria-labelledby="hero-title">
    <div class="hero-copy relative z-10 min-w-0" :class="{ 'hero-copy-with-image': hero.imagePath }">
      <HeroTitle :title="hero.title" :accent-title="hero.accentTitle" :text="hero.text" :regalia="hero.regalia" />
      <div class="hero-actions mt-9 flex flex-wrap gap-4 tablet:mt-14 tablet:gap-9">
        <HeroButton :label="hero.primaryButtonLabel" @click="emit('request')" />
        <HeroButton :label="hero.secondaryButtonLabel" secondary href="/services" />
      </div>
    </div>
    <div v-if="hero.imagePath" class="hero-art pointer-events-none">
      <HeroImage :path="hero.imagePath" alt="Инженерные системы здания" />
    </div>
  </section>
</template>

<style scoped>
@reference "../../../assets/css/main.css";

.site-hero { font-family: Montserrat, sans-serif; }
.site-hero :deep(.hero-title) { font-size: clamp(30px, 3.125vw, 60px); line-height: 1.12; overflow-wrap: anywhere; }
.site-hero :deep(.hero-regalia) { font-size: clamp(15px, 1.25vw, 24px); }
.site-hero :deep(.hero-button:focus-visible) { outline: 2px solid var(--color-site-brand); outline-offset: 5px; }

@variant desktop {
  .site-hero { min-height: clamp(510px, 34.3vw, 658px); }
  .hero-copy-with-image { max-width: 46%; }
  .hero-art {
    position: absolute;
    inset: 0 auto auto 29%;
    width: 88%;
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, black 19%, black 92%, transparent);
  }
  .hero-art :deep(.hero-image) {
    margin-top: -8.5%;
    mask-image: linear-gradient(to bottom, black 84%, transparent);
  }
  .hero-actions { column-gap: clamp(18px, 1.875vw, 36px); }
  .hero-actions :deep(.hero-button) { min-height: clamp(56px, 3.65vw, 70px); }
  .hero-actions :deep(.hero-button:not(.hero-button-secondary)) { width: clamp(202px, 18.33vw, 352px); }
  .hero-actions :deep(.hero-button-secondary) { width: clamp(140px, 12.08vw, 232px); }
}

@media (max-width: 767px) {
  .site-hero { gap: 24px; padding: 24px 10px 32px; }
  .hero-art { grid-row: 1; }
  .site-hero :deep(.hero-title) { font-size: 32px; line-height: 1.1; white-space: normal; overflow-wrap: normal; }
  .site-hero :deep(.hero-title > .text-site-brand) { display: inline; }
  .site-hero :deep(.hero-title > .text-site-brand)::before { content: ' '; }
  .site-hero :deep(.hero-regalia) { margin-top: 20px; font-size: 18px; gap: 4px 10px; }
  .site-hero :deep(.hero-regalia > li) { display: contents; }
  .hero-actions { margin-top: 32px; gap: 10px; }
  .site-hero :deep(.hero-button) { width: 100%; }
}
</style>
