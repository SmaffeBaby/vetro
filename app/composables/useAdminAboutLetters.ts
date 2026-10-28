import type { AboutLettersSettings } from '#shared/types/about-letters'
import { defaultAboutLetters } from '#shared/config/default-about-letters'
import { aboutLettersInputSchema } from '#shared/utils/about-letters'
export function useAdminAboutLetters() {
  const { adminFetch, contentFetch } = useAdminAuth()
  const form = reactive<AboutLettersSettings>(structuredClone(defaultAboutLetters))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && JSON.stringify(form) !== snapshot.value)
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  function accept(value: AboutLettersSettings) { Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await contentFetch<AboutLettersSettings>('/api/about-letters')) }
    catch { error.value = 'Не удалось загрузить блок «Благодарственные письма». Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = aboutLettersInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля карточек'; return }
    saving.value = true
    try {
      accept(await adminFetch<AboutLettersSettings>('/api/admin/about-letters', { method: 'PUT', body: parsed.data }))
      notice.value = 'Блок «Благодарственные письма» опубликован на странице /about.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить блок «Благодарственные письма». Повторите попытку.' }
    finally { saving.value = false }
  }
  function addCard() {
    if (saving.value || form.cards.length >= 50) return
    form.cards.push({ id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, organization: '', reference: '', tag: '', text: '', author: '', position: '' })
  }
  function removeCard(index: number) { if (!saving.value) form.cards.splice(index, 1) }
  function moveCard(index: number, delta: number) {
    const target = index + delta
    if (saving.value || target < 0 || target >= form.cards.length) return
    const card = form.cards.splice(index, 1)[0]!
    form.cards.splice(target, 0, card)
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !saving.value && (!isDirty.value || window.confirm('Есть несохранённые изменения блока «Благодарственные письма». Покинуть страницу?'))
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, addCard, removeCard, moveCard, discard }
}
