<script setup lang="ts">
const { data: contacts } = await useContactsPage()
useHead({ title: () => `${contacts.value.page.title} · Ветро`, meta: [{ name: 'description', content: () => contacts.value.items.map(item => item.text).join('. ') }] })
</script>

<template>
  <div class="contacts-page min-h-screen bg-white text-[#203e63]">
    <Header @request="navigateTo('/contacts#write-us')" />
    <main>
    <div class="mx-auto grid max-w-480 gap-10 px-5 pb-16 pt-10 tablet:px-8 tablet:pb-24 tablet:pt-16 desktop:grid-cols-[0.9fr_1fr] desktop:gap-16 desktop:px-[4.95%] desktop:pt-20">
      <ContactsDetails :contacts="contacts" />
      <ContactsYandexMap :src="contacts.page.mapSrc" :href="contacts.page.mapHref" :title="contacts.page.mapTitle" variant="page" />
    </div>
    <ContactsWriteUs :content="contacts.page.form" />
    </main>
    <Footer @request="navigateTo('/contacts#write-us')" />
  </div>
</template>

<style scoped>
.contacts-page { font-family: Montserrat, sans-serif; }
</style>
