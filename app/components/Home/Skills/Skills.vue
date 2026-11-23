<script setup lang="ts">
const { data: skills } = await useSkills()
</script>

<template>
  <section v-if="skills.cards.length" id="skills" class="site-skills relative grid gap-8 px-5 pb-16 pt-4 text-site-ink tablet:px-8 tablet:pb-24 desktop:grid-cols-[17.4%_minmax(0,1fr)] desktop:gap-[1.8%] desktop:px-[4.95%] desktop:pb-[4.4%] desktop:pt-0" aria-labelledby="skills-title">
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
