<script setup lang="ts">
import { sortFooterColumns } from '#shared/utils/footer'
const { data: footer } = await useFooter()
const year = useFooterYear()
const columns = computed(() => sortFooterColumns(footer.value.columns))
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <footer id="footer" class="site-footer bg-site-ink text-site-on-dark">
    <div class="footer-inner mx-auto max-w-480 px-5 py-12 tablet:px-8 tablet:py-16 desktop:px-[4.95%] desktop:pb-15 desktop:pt-20">
      <div class="grid items-start gap-10 desktop:grid-cols-[minmax(180px,1fr)_minmax(0,2fr)_minmax(240px,352px)] desktop:gap-14">
        <FooterLeftContent :svg="footer.logoSvg" :path="footer.logoPath" :text="footer.text" :year="year" />
        <div class="footer-columns grid min-w-0 gap-8 tablet:grid-cols-2"><FooterColumnFooter v-for="column in columns" :key="column.id" :column="column" :year="year" /></div>
        <AboutCardButton :label="footer.buttonLabel" class="footer-cta" @click="emit('request')" />
      </div>
      <div class="footer-bottom mt-14 grid gap-6 text-base leading-normal tablet:mt-20 desktop:mt-30 desktop:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <FooterLeftBottom :items="footer.leftBottom" :year="year" />
        <FooterRightBottom :items="footer.rightBottom" :year="year" />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer { font-family: Montserrat, sans-serif; }
.site-footer :deep(a:focus-visible), .site-footer :deep(button:focus-visible) { outline: 2px solid var(--color-site-brand); outline-offset: 5px; }
.site-footer :deep(.footer-cta) { width: 100%; max-width: 352px; min-height: 70px; }
.site-footer :deep(.footer-code a) { color: var(--color-site-brand); }
.site-footer :deep(.footer-code a:hover) { text-decoration: underline; }
.site-footer :deep(.footer-code ul) { list-style: disc; padding-left: 1.25em; }
.site-footer :deep(.footer-code ol) { list-style: decimal; padding-left: 1.25em; }
@media (max-width: 767px) {
  .site-footer { text-align: center; }
  .footer-inner { padding: 40px 10px; }
  .footer-columns { gap: 60px; }
  .footer-bottom { margin-top: 40px; gap: 48px; }
  .site-footer :deep(.footer-brand p) { max-width: 210px; margin-inline: auto; }
  .site-footer :deep(ul.flex) { justify-content: center; }
  .site-footer :deep(.footer-cta) { margin-inline: auto; }
}
</style>
