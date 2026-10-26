<script setup lang="ts">
const { data: skills } = await useSkills()
</script>

<template>
  <section v-if="skills.cards.length" id="skills" class="site-skills mx-auto grid max-w-480 gap-8 px-5 pb-16 pt-4 text-site-ink tablet:px-8 tablet:pb-24 desktop:grid-cols-[clamp(210px,15.625vw,300px)_minmax(0,1fr)] desktop:gap-[clamp(20px,1.6667vw,32px)] desktop:px-[4.95%] desktop:pb-32 desktop:pt-4" aria-labelledby="skills-title">
    <SkillsTitle />
    <SkillsCards :cards="skills.cards" />
  </section>
</template>

<style scoped>
.site-skills { font-family: Montserrat, sans-serif; }
@media (max-width: 767px) {
  .site-skills { padding: 16px 10px 40px; gap: 30px; }
  .site-skills :deep(#skills-title) { font-size: 32px; }
}
</style>
