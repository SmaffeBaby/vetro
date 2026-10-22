<script setup lang="ts">
import type { PrivacySettings } from '#shared/types/privacy'
import { privacySectionId } from '#shared/utils/privacy'
const props = defineProps<{ content: PrivacySettings }>()
const root = ref<HTMLElement | null>(null)
const open = ref(false)
const active = ref(props.content.sections[0]?.id || '')
let frame = 0
function update() {
  frame = 0
  const sections = root.value?.querySelectorAll<HTMLElement>('[data-privacy-section]')
  if (!sections?.length) return
  const threshold = window.innerWidth >= 1200 ? 180 : window.innerWidth >= 768 ? 228 : 196
  let current = sections[0]!
  for (const section of sections) { if (section.getBoundingClientRect().top <= threshold) current = section }
  active.value = current.id.replace(/^privacy-/, '')
}
function schedule() { if (!frame) frame = requestAnimationFrame(update) }
async function select(event: MouseEvent, id: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  open.value = false
  await nextTick()
  const targetId = privacySectionId(id)
  window.location.hash = targetId
  document.getElementById(targetId)?.scrollIntoView({ block: 'start' })
  schedule()
}
watch(() => props.content.sections, schedule, { flush: 'post' })
onMounted(() => { update(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule) })
onBeforeUnmount(() => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) })
</script>

<template>
  <div ref="root" class="mt-10 grid min-w-0 items-start gap-8 tablet:mt-14 desktop:mt-20 desktop:grid-cols-[minmax(240px,0.45fr)_minmax(0,1fr)] desktop:gap-16">
    <aside class="sticky top-24 z-30 min-w-0 self-start rounded-xl border border-site-line bg-site-surface tablet:top-32 desktop:top-40 desktop:z-10 desktop:rounded-none desktop:border-0">
      <button type="button" :aria-expanded="open" aria-controls="privacy-navigation" class="flex min-h-12 w-full items-center justify-between gap-4 px-4 py-3 text-left font-semibold focus-visible:outline-2 focus-visible:outline-site-brand desktop:hidden" @click="open = !open"><span>{{ content.navigationLabel }}</span><UIcon :name="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="size-5 shrink-0" /></button>
      <nav id="privacy-navigation" :aria-label="content.navigationLabel" class="max-h-[50svh] overflow-y-auto px-4 pb-4 desktop:max-h-[calc(100svh-180px)] desktop:p-0" :class="open ? 'block' : 'hidden desktop:block'">
        <ol class="space-y-4"><li v-for="(section, index) in content.sections" :key="section.id"><a :href="`#${privacySectionId(section.id)}`" :aria-current="active === section.id ? 'location' : undefined" class="block text-base font-medium leading-snug [overflow-wrap:anywhere] hover:text-site-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-brand tablet:text-lg" :class="active === section.id ? 'text-site-brand' : 'text-site-ink'" @click="select($event, section.id)">{{ index + 1 }}. {{ section.title }}</a></li></ol>
      </nav>
    </aside>
    <div class="min-w-0 space-y-8 tablet:space-y-10"><PrivacySection v-for="(section, index) in content.sections" :key="section.id" :section="section" :index="index" /></div>
  </div>
</template>
