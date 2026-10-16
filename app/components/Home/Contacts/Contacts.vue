<script setup lang="ts">
const { data: contacts } = await useContacts()
const emit = defineEmits<{ request: [] }>()
</script>

<template>
  <section id="contacts" aria-labelledby="contacts-title" class="site-contacts mx-auto max-w-480 px-5 pb-16 text-[#203e63] tablet:px-8 tablet:pb-24 desktop:px-[4.95%]">
    <div class="grid overflow-hidden rounded-[20px] bg-[#f5f6f8] desktop:grid-cols-[38%_62%]">
      <ContactsLeftSide :items="contacts.items" @request="emit('request')" />
      <ContactsYandexMap />
    </div>
  </section>
</template>

<style scoped>
.site-contacts { font-family: Montserrat, sans-serif; }
.site-contacts :deep(a:focus-visible), .site-contacts :deep(button:focus-visible) { outline: 2px solid #2a9ccf; outline-offset: 4px; }
</style>
