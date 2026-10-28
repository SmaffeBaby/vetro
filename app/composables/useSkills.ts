import type { SkillCard, SkillsSettings } from '#shared/types/skills'
import { defaultSkills } from '#shared/config/default-skills'
import { mediaUrl } from '#shared/utils/media'
import { sortSkillCards } from '#shared/utils/skills'

export function useSkills() {
  return useSiteQuery<SkillsSettings>('/api/skills', { default: () => structuredClone(defaultSkills) })
}

export function useSkillRows(cards: () => SkillCard[]) {
  return computed(() => {
    const sorted = sortSkillCards(cards())
    return Array.from({ length: Math.ceil(sorted.length / 5) }, (_, i) => sorted.slice(i * 5, i * 5 + 5))
  })
}

export function useSkillDisclosure(cards: () => SkillCard[]) {
  const hovered = ref<string | null>(null)
  const focused = ref<string | null>(null)
  const activeId = computed(() => {
    const sorted = sortSkillCards(cards())
    return [hovered.value, focused.value].find(id => sorted.some(card => card.id === id)) ?? sorted[0]?.id
  })
  function focusCard(id: string, event: FocusEvent) {
    if ((event.target as HTMLElement).matches(':focus-visible')) focused.value = id
  }
  return { activeId, hovered, focused, focusCard }
}

export function useSkillIcon(card: () => Pick<SkillCard, 'svg' | 'iconPath'>) {
  return computed(() => card().iconPath ? mediaUrl(card().iconPath!) : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(card().svg)}`)
}
