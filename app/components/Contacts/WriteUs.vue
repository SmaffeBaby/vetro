<script setup lang="ts">
import type { ContactFormSettings } from '#shared/types/contacts'
defineProps<{ content: ContactFormSettings }>()
const inputClass = 'min-h-12 w-full rounded-lg border border-[#d0d5dd] bg-white px-4 py-3 text-base text-[#203e63] placeholder:text-[#98a2b3] focus:border-[#2a9ccf] focus:outline-2 focus:outline-offset-2 focus:outline-[#2a9ccf]'
</script>

<template>
  <section v-if="content.enabled" id="write-us" aria-labelledby="contacts-write-us-title" class="bg-[#f7f8fa] py-16 tablet:py-24">
    <div class="mx-auto grid max-w-480 gap-10 px-5 tablet:px-8 desktop:grid-cols-[0.9fr_1fr] desktop:gap-16 desktop:px-[4.95%]">
      <div class="min-w-0">
        <h2 id="contacts-write-us-title" class="whitespace-pre-line text-[36px] font-bold leading-tight [overflow-wrap:anywhere] tablet:text-5xl desktop:text-[60px]">{{ content.title }}</h2>
        <p v-if="content.text" class="mt-6 max-w-xl whitespace-pre-line text-xl leading-snug [overflow-wrap:anywhere] tablet:text-2xl">{{ content.text }}</p>
        <div v-if="content.phoneText" class="mt-10 tablet:mt-12"><h3 v-if="content.phoneTitle" class="text-lg font-bold text-[#182230] tablet:text-xl">{{ content.phoneTitle }}</h3><a :href="content.phoneHref" class="mt-3 inline-block text-lg font-bold text-[#2a9ccf] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]">{{ content.phoneText }}</a></div>
      </div>
      <form class="min-w-0" @submit.prevent>
        <div class="grid gap-x-5 gap-y-7 tablet:grid-cols-2">
          <div v-for="field in (['name', 'phone', 'email'] as const)" :key="field" class="min-w-0">
            <label :for="`contact-form-${field}`" class="mb-2 block text-sm font-semibold text-[#182230]">{{ content.fields[field].label }}<span v-if="content.fields[field].required" aria-hidden="true">*</span></label>
            <input :id="`contact-form-${field}`" :name="field" :type="field === 'phone' ? 'tel' : field === 'email' ? 'email' : 'text'" :autocomplete="field === 'phone' ? 'tel' : field" :placeholder="content.fields[field].placeholder" :required="content.fields[field].required" :class="inputClass" />
          </div>
          <div class="min-w-0">
            <label for="contact-form-subject" class="mb-2 block text-sm font-semibold text-[#182230]">{{ content.fields.subject.label }}<span v-if="content.fields.subject.required" aria-hidden="true">*</span></label>
            <select id="contact-form-subject" name="subject" :required="content.fields.subject.required" :class="inputClass" class="pr-10">
              <option value="" disabled selected>{{ content.fields.subject.placeholder }}</option>
              <option v-for="topic in content.topics" :key="topic" :value="topic">{{ topic }}</option>
            </select>
          </div>
          <div class="tablet:col-span-2">
            <label for="contact-form-message" class="mb-2 block text-sm font-semibold text-[#182230]">{{ content.fields.message.label }}<span v-if="content.fields.message.required" aria-hidden="true">*</span></label>
            <textarea id="contact-form-message" name="message" :placeholder="content.fields.message.placeholder" :required="content.fields.message.required" :class="inputClass" class="min-h-32 resize-y" rows="4" />
          </div>
        </div>
        <label class="mt-7 flex items-start gap-3 text-sm leading-relaxed text-[#667085]"><input type="checkbox" name="consent" :required="content.consentRequired" class="mt-0.5 size-5 shrink-0 accent-[#2a9ccf] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]" /><span class="whitespace-pre-line [overflow-wrap:anywhere]">{{ content.consentText }}</span></label>
        <button type="submit" class="mt-7 min-h-12 w-full rounded-lg bg-[#2a9ccf] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#2184b0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a9ccf]">{{ content.buttonLabel }}</button>
      </form>
    </div>
  </section>
</template>
