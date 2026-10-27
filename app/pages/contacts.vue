<script setup lang="ts">
const { data: contacts } = await useContactsPage()
useHead({ title: () => `${contacts.value.page.title} · Ветро`, meta: [{ name: 'description', content: () => contacts.value.items.map(item => item.text).join('. ') }] })
</script>

<template>
  <div class="contacts-page min-h-screen bg-white text-site-ink">
    <Header @request="navigateTo('/contacts#write-us')" />
    <main>
    <div class="contacts-overview mx-auto grid max-w-480 gap-10 px-5 pb-16 pt-10 tablet:px-8 tablet:pb-24 tablet:pt-16 desktop:grid-cols-[0.9fr_1fr] desktop:gap-16 desktop:px-[4.95%] desktop:pt-20">
      <ContactsDetails :contacts="contacts" />
      <ContactsYandexMap class="contacts-map" :src="contacts.page.mapSrc" :href="contacts.page.mapHref" :title="contacts.page.mapTitle" variant="page" />
    </div>
    <ContactsWriteUs :content="contacts.page.form" />
    </main>
    <Footer @request="navigateTo('/contacts#write-us')" />
  </div>
</template>

<style scoped>
.contacts-page { font-family: Montserrat, sans-serif; }
@media (max-width: 767px) {
  .contacts-overview { padding: 24px 10px 40px; }
  .contacts-page :deep(#contacts-page-title) { font-size: 32px; }
  .contacts-page :deep(.contacts-details dl) { margin-top: 24px; }
  .contacts-page :deep(.contacts-details dl > div + div) { margin-top: 32px; }
  .contacts-page :deep(.contacts-details dt), .contacts-page :deep(.contacts-details dd) { font-size: 18px; line-height: 1.4; }
  .contacts-page :deep(.contacts-details .contacts-hours) { margin-top: 0; font-size: 14px; }
  .contacts-page :deep(.contacts-requisites) { margin-top: 40px; }
  .contacts-page :deep(.contacts-requisites p) { margin-top: 32px; line-height: 1.6; }
  .contacts-page :deep(.contacts-map) { margin-inline: -10px; min-height: 500px; border-radius: 16px; }
  .contacts-page :deep(#write-us) { scroll-margin-top: 88px; padding: 40px 0 30px; }
  .contacts-page :deep(#write-us > div) { padding-inline: 10px; }
  .contacts-page :deep(#contacts-write-us-title) { font-size: 32px; }
  .contacts-page :deep(#contacts-write-us-title + p) { margin-top: 24px; font-size: 18px; line-height: 1.4; }
  .contacts-page :deep(#contact-form-message) { min-height: 120px; }
  .contacts-page :deep(#contact-form-subject:has(option:checked[value=""])) { color: var(--color-site-muted); }
}
</style>
