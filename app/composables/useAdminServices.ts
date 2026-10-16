import type { ServiceCard, ServicesSettings } from '#shared/types/services'
import { defaultServices } from '#shared/config/default-services'
import { servicesInputSchema, sortServiceCards } from '#shared/utils/services'

export function useAdminServices() {
  const { adminFetch } = useAdminAuth()
  const media = useMedia('Services/Cards')
  const form = reactive<ServicesSettings>(structuredClone(defaultServices))
  const loading = ref(true)
  const saving = ref(false)
  const loaded = ref(false)
  const error = ref('')
  const notice = ref('')
  const snapshot = ref('')
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || !!form.mediaCleanupPending))
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  const iconPreview = (card: ServiceCard) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(card.svg)}`

  function accept(settings: ServicesSettings) {
    Object.assign(form, structuredClone(settings)); snapshot.value = JSON.stringify(form); loaded.value = true
  }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await $fetch<ServicesSettings>('/api/services')) }
    catch { error.value = 'Не удалось загрузить услуги. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = servicesInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message ?? 'Проверьте поля карточек'; return }
    saving.value = true
    try {
      accept(await adminFetch<ServicesSettings>('/api/admin/services', { method: 'PUT', body: parsed.data }))
      await refreshNuxtData('site-services')
      if (form.mediaCleanupPending) error.value = 'Услуги сохранены, но старые SVG не удалены из Storage. Нажмите «Сохранить» для повторной попытки.'
      else notice.value = 'Услуги опубликованы. Изменения доступны на странице услуг.'
    } catch (e) {
      error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить услуги. Повторите попытку.'
    } finally { saving.value = false }
  }
  function addCard() {
    if (saving.value || form.cards.length >= 12) return
    const sortOrder = Math.min(999_999, Math.max(0, ...form.cards.map(card => Number(card.sortOrder) || 0)) + 10)
    form.cards.push({ id: `service-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, svg: '', iconFilename: 'icon.svg', sortOrder, title: '', text: '' })
  }
  function removeCard(index: number) { if (!saving.value) form.cards.splice(index, 1) }
  function arrangeCards() { form.cards = sortServiceCards(form.cards) }
  function moveCard(index: number, delta: number) {
    const target = index + delta
    if (saving.value || target < 0 || target >= form.cards.length) return
    const card = form.cards.splice(index, 1)[0]!
    form.cards.splice(target, 0, card)
    form.cards.forEach((item, i) => { item.sortOrder = (i + 1) * 10 })
  }
  async function uploadSvg(event: Event, card: ServiceCard) {
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
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения услуг. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, iconPreview, load, save, addCard, removeCard, arrangeCards, moveCard, uploadSvg, discard }
}
