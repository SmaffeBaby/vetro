import type { PrivacySettings } from '#shared/types/privacy'
import { defaultPrivacy } from '#shared/config/default-privacy'
import { privacyInputSchema } from '#shared/utils/privacy'
export function useAdminPrivacy() {
  const { adminFetch, contentFetch } = useAdminAuth()
  const form = reactive<PrivacySettings>(structuredClone(defaultPrivacy))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && JSON.stringify(form) !== snapshot.value)
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  function accept(value: PrivacySettings) { Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await contentFetch<PrivacySettings>('/api/privacy')) }
    catch { error.value = 'Не удалось загрузить блок «Политика конфиденциальности». Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = privacyInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля карточек'; return }
    saving.value = true
    try {
      accept(await adminFetch<PrivacySettings>('/api/admin/privacy', { method: 'PUT', body: parsed.data }))
      notice.value = 'Блок «Политика конфиденциальности» опубликован на странице /privacy.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить блок «Политика конфиденциальности». Повторите попытку.' }
    finally { saving.value = false }
  }
  function addCard() {
    if (saving.value || form.sections.length >= 50) return
    form.sections.push({ id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: '', text: '' })
  }
  function removeCard(index: number) { if (!saving.value) form.sections.splice(index, 1) }
  function moveCard(index: number, delta: number) {
    const target = index + delta
    if (saving.value || target < 0 || target >= form.sections.length) return
    const card = form.sections.splice(index, 1)[0]!
    form.sections.splice(target, 0, card)
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !saving.value && (!isDirty.value || window.confirm('Есть несохранённые изменения блока «Политика конфиденциальности». Покинуть страницу?'))
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, addCard, removeCard, moveCard, discard }
}
