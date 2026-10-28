import type { WhyCard, WhySettings } from '#shared/types/why'
import { defaultWhy } from '#shared/config/default-why'
import { sortWhyCards, whyInputSchema } from '#shared/utils/why'
export function useAdminWhy() {
  const { adminFetch, contentFetch } = useAdminAuth()
  const media = useMedia('Why')
  const form = reactive<WhySettings>(structuredClone(defaultWhy))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || !!form.mediaCleanupPending))
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  const iconPreview = (item: WhyCard) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.svg)}`
  const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  function accept(value: WhySettings) { Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await contentFetch<WhySettings>('/api/why')) }
    catch { error.value = 'Не удалось загрузить карточки. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = whyInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля карточек'; return }
    saving.value = true
    try {
      accept(await adminFetch<WhySettings>('/api/admin/why', { method: 'PUT', body: parsed.data }))
      if (form.mediaCleanupPending) error.value = 'Карточки сохранены, но старые SVG не удалены из Storage. Нажмите «Сохранить» для повторной попытки.'
      else notice.value = 'Карточки опубликованы. Изменения доступны на главной странице.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить карточки. Повторите попытку.' }
    finally { saving.value = false }
  }
  function addCard() {
    if (!saving.value && form.cards.length < 12) form.cards.push({ id: newId('why'), sortOrder: Math.min(999999, Math.max(0, ...form.cards.map(card => card.sortOrder)) + 10), svg: '', iconFilename: 'logo.svg', title: '', points: [''] })
  }
  function removeCard(index: number) { if (!saving.value) form.cards.splice(index, 1) }
  function sortCards() { if (!saving.value) form.cards = sortWhyCards(form.cards) }
  function moveCard(index: number, delta: number) {
    const target = index + delta
    if (saving.value || target < 0 || target >= form.cards.length) return
    const item = form.cards[index]!
    form.cards[index] = form.cards[target]!
    form.cards[target] = item
    form.cards.forEach((card, index) => { card.sortOrder = (index + 1) * 10 })
  }
  function addPoint(item: WhyCard) { if (!saving.value && item.points.length < 12) item.points.push('') }
  function removePoint(item: WhyCard, index: number) { if (!saving.value) item.points.splice(index, 1) }
  async function uploadSvg(event: Event, item: WhyCard) {
    const input = event.target as HTMLInputElement, file = input.files?.[0]
    if (!file || saving.value) return
    error.value = ''; notice.value = ''
    try { const selected = await media.readFile(file, { svgOnly: true }); item.svg = selected.text; item.iconFilename = selected.name }
    catch (e) { error.value = (e as Error).message }
    finally { input.value = '' }
  }
  function removeSvg(item: WhyCard) { if (!saving.value) { item.svg = ''; item.iconFilename = 'logo.svg' } }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения карточек. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, iconPreview, load, save, addCard, removeCard, moveCard, sortCards, addPoint, removePoint, uploadSvg, removeSvg, discard }
}
