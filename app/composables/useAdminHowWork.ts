import type { HowWorkSettings } from '#shared/types/how-work'
import { defaultHowWork } from '#shared/config/default-how-work'
import { howWorkInputSchema, sortWorkCards } from '#shared/utils/how-work'
export function useAdminHowWork() {
  const { adminFetch } = useAdminAuth()
  const form = reactive<HowWorkSettings>(structuredClone(defaultHowWork))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && JSON.stringify(form) !== snapshot.value)
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  function accept(value: HowWorkSettings) { Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await $fetch<HowWorkSettings>('/api/how-work')) }
    catch { error.value = 'Не удалось загрузить этапы работы. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = howWorkInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля карточек'; return }
    saving.value = true
    try {
      accept(await adminFetch<HowWorkSettings>('/api/admin/how-work', { method: 'PUT', body: parsed.data }))
      await refreshNuxtData('site-how-work')
      notice.value = 'Этапы работы опубликованы. Изменения доступны на главной странице.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить этапы работы. Повторите попытку.' }
    finally { saving.value = false }
  }
  function addCard() {
    if (saving.value || form.cards.length >= 12) return
    form.cards.push({ id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, sortOrder: Math.min(999999, Math.max(0, ...form.cards.map(card => card.sortOrder)) + 10), title: '', text: '' })
  }
  function removeCard(index: number) { if (!saving.value) form.cards.splice(index, 1) }
  function arrangeCards() { if (!saving.value) form.cards = sortWorkCards(form.cards) }
  function moveCard(index: number, delta: number) {
    const target = index + delta
    if (saving.value || target < 0 || target >= form.cards.length) return
    const card = form.cards.splice(index, 1)[0]!
    form.cards.splice(target, 0, card)
    form.cards.forEach((item, i) => { item.sortOrder = (i + 1) * 10 })
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения этапов работы. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, addCard, removeCard, arrangeCards, moveCard, discard }
}
