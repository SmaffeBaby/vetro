<script setup lang="ts">
import type { ContactsSettings } from '#shared/types/contacts'
defineProps<{ contacts: ContactsSettings }>()
const year = useFooterYear()
</script>

<template>
  <div class="min-w-0">
    <h1 id="contacts-page-title" class="text-[40px] font-bold leading-tight tablet:text-5xl desktop:text-[60px]">{{ contacts.page.title }}</h1>
    <dl class="mt-10 space-y-6 tablet:mt-12">
      <div v-for="id in (['address', 'phone', 'email'] as const)" :key="id">
        <template v-for="item in contacts.items.filter(item => item.id === id)" :key="item.id">
          <dt class="mb-1 text-xl font-medium text-[#94a3b8] tablet:text-2xl">{{ item.title }}</dt>
          <dd class="text-xl font-medium leading-snug tablet:text-2xl" :class="{ 'text-[#2a9ccf]': id === 'email' }"><FooterEntry :item="item" :year="year" /></dd>
          <dd v-if="id === 'address' && contacts.page.hours" class="mt-2 whitespace-pre-line text-base text-[#94a3b8] tablet:text-lg">{{ contacts.page.hours }}</dd>
        </template>
      </div>
    </dl>
    <ContactsSocials :socials="contacts.page.socials" class="mt-10" />
    <section v-if="contacts.page.requisites" aria-labelledby="contacts-requisites-title" class="mt-14 tablet:mt-16">
      <h2 id="contacts-requisites-title" class="text-base font-medium">{{ contacts.page.requisitesTitle }}</h2>
      <p class="mt-6 whitespace-pre-line text-base leading-loose text-[#94a3b8] [overflow-wrap:anywhere]">{{ contacts.page.requisites }}</p>
    </section>
  </div>
</template>
