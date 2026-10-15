import type { SkillCard, SkillsSettings } from '#shared/types/skills'
import { defaultSkills } from '#shared/config/default-skills'
import { skillsInputSchema, sortSkillCards } from '#shared/utils/skills'

export function useAdminSkills() {
  const { adminFetch } = useAdminAuth()
  const media = useMedia('Skills')
  const form = reactive<SkillsSettings>(structuredClone(defaultSkills))
  const loading = ref(true)
  const saving = ref(false)
  const loaded = ref(false)
  const error = ref('')
  const notice = ref('')
  const snapshot = ref('')
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || !!form.mediaCleanupPending))
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  const iconPreview = (card: SkillCard) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(card.svg)}`

  function accept(settings: SkillsSettings) {
    Object.assign(form, structuredClone(settings)); snapshot.value = JSON.stringify(form); loaded.value = true
  }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await $fetch<SkillsSettings>('/api/skills')) }
    catch { error.value = 'Не удалось загрузить компетенции. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = skillsInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message ?? 'Проверьте поля карточек'; return }
    saving.value = true
    try {
      accept(await adminFetch<SkillsSettings>('/api/admin/skills', { method: 'PUT', body: parsed.data }))
      await refreshNuxtData('site-skills')
      if (form.mediaCleanupPending) error.value = 'Компетенции сохранены, но старые SVG не удалены из Storage. Нажмите «Сохранить» для повторной попытки.'
      else notice.value = 'Компетенции опубликованы. Изменения доступны на главной странице.'
    } catch (e) {
      error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить компетенции. Повторите попытку.'
    } finally { saving.value = false }
  }
  function addCard() {
    if (saving.value || form.cards.length >= 12) return
    const sortOrder = Math.min(999_999, Math.max(0, ...form.cards.map(card => Number(card.sortOrder) || 0)) + 10)
    form.cards.push({ id: `skill-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, svg: '', iconFilename: 'icon.svg', sortOrder, title: '', text: '' })
  }
  function removeCard(index: number) { if (!saving.value) form.cards.splice(index, 1) }
  function arrangeCards() { form.cards = sortSkillCards(form.cards) }
  function moveCard(index: number, delta: number) {
    const target = index + delta
    if (saving.value || target < 0 || target >= form.cards.length) return
    const card = form.cards.splice(index, 1)[0]!
    form.cards.splice(target, 0, card)
    form.cards.forEach((item, i) => { item.sortOrder = (i + 1) * 10 })
  }
  async function uploadSvg(event: Event, card: SkillCard) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file || saving.value) return
    error.value = ''; notice.value = ''
    try { const selected = await media.readFile(file, { svgOnly: true }); card.svg = selected.text; card.iconFilename = selected.name }
    catch (e) { error.value = (e as Error).message }
    finally { input.value = '' }
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения компетенций. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, iconPreview, load, save, addCard, removeCard, arrangeCards, moveCard, uploadSvg, discard }
}
