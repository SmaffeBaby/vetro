<script setup lang="ts">
const { data: faq } = await useFaq()
</script>

<template>
  <section v-if="faq.questions.length || faq.benefits.length" id="faq" aria-labelledby="faq-title" class="site-faq mx-auto max-w-480 px-5 pb-16 text-[#203e63] tablet:px-8 tablet:pb-24 desktop:px-[4.95%]">
    <SectionTitle id="faq-title" text="Часто задаваемые вопросы" />
    <div class="mt-10 grid items-start gap-8 tablet:mt-14 desktop:mt-15" :class="faq.questions.length && faq.benefits.length ? 'desktop:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]' : 'grid-cols-1'">
      <FAQAccordion v-if="faq.questions.length" :questions="faq.questions" />
      <FAQCard v-if="faq.benefits.length" :benefits="faq.benefits" />
    </div>
  </section>
</template>

<style scoped>
.site-faq { font-family: Montserrat, sans-serif; }
</style>
