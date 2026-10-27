<script setup lang="ts">
const { data: contacts } = await useContacts()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <section id="contacts" aria-labelledby="contacts-title" class="site-contacts mx-auto max-w-480 px-5 pb-16 text-site-ink tablet:px-8 tablet:pb-24 desktop:px-[4.95%]">
    <div class="grid overflow-hidden rounded-[20px] bg-site-surface desktop:grid-cols-[38%_62%]">
      <ContactsLeftSide class="home-contact-details" :items="contacts.items" @request="emit('request')" />
      <ContactsYandexMap class="home-contact-map" :src="contacts.page.mapSrc" :href="contacts.page.mapHref" :title="contacts.page.mapTitle" />
    </div>
  </section>
</template>

<style scoped>
.site-contacts { font-family: Montserrat, sans-serif; }
.site-contacts :deep(a:focus-visible), .site-contacts :deep(button:focus-visible) { outline: 2px solid var(--color-site-brand); outline-offset: 4px; }
@media (max-width: 767px) {
  .site-contacts { padding-inline: 0; padding-bottom: 0; }
  .site-contacts > .grid { border-radius: 0; }
  .site-contacts :deep(.home-contact-details) { padding: 32px 10px 40px; }
  .site-contacts :deep(#contacts-title) { margin-bottom: 24px; font-size: 32px; text-transform: none; }
  .site-contacts :deep(.home-contact-map) { min-height: 470px; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
}
</style>
