import type { AboutCardSettings } from '#shared/types/about-card'
import { defaultAboutCard } from '#shared/config/default-about-card'
import { aboutCardInputSchema } from '#shared/utils/about-card'

export function useAdminAboutCard() {
  const { adminFetch, contentFetch } = useAdminAuth()
  const form = reactive<AboutCardSettings>(structuredClone(defaultAboutCard))
  const loading = ref(true)
  const saving = ref(false)
  const loaded = ref(false)
  const error = ref('')
  const notice = ref('')
  const snapshot = ref('')
  const isDirty = computed(() => loaded.value && JSON.stringify(form) !== snapshot.value)
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')

  function accept(settings: AboutCardSettings) {
    Object.assign(form, structuredClone(settings)); snapshot.value = JSON.stringify(form); loaded.value = true
  }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await contentFetch<AboutCardSettings>('/api/about-card')) }
    catch { error.value = 'Не удалось загрузить AboutCard. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = aboutCardInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message ?? 'Проверьте поля'; return }
    saving.value = true
    try {
      accept(await adminFetch<AboutCardSettings>('/api/admin/about-card', { method: 'PUT', body: parsed.data }))
      notice.value = 'AboutCard опубликован. Изменения доступны на главной странице.'
    } catch (e) {
      error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить AboutCard. Повторите попытку.'
    } finally { saving.value = false }
  }
  function addLeftItem() {
    if (!saving.value && form.leftItems.length < 12) form.leftItems.push({ id: `left-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: '', text: '' })
  }
  function addRightItem() {
    if (!saving.value && form.rightItems.length < 12) form.rightItems.push({ id: `right-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text: '' })
  }
  function removeItem(side: 'leftItems' | 'rightItems', index: number) { if (!saving.value) form[side].splice(index, 1) }
  function moveItem(side: 'leftItems' | 'rightItems', index: number, delta: number) {
    const items = form[side]
    const target = index + delta
    if (saving.value || target < 0 || target >= items.length) return
    // Swap within the same list to preserve each item's fields and stable ID.
    const item = items[index]!
    items[index] = items[target]!
    items[target] = item
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения AboutCard. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, discard, addLeftItem, addRightItem, removeItem, moveItem }
}
