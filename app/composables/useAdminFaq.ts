import type { FaqBenefit, FaqSettings } from '#shared/types/faq'
import { defaultFaq } from '#shared/config/default-faq'
import { faqInputSchema } from '#shared/utils/faq'
export function useAdminFaq() {
  const { adminFetch } = useAdminAuth()
  const media = useMedia('FAQ')
  const form = reactive<FaqSettings>(structuredClone(defaultFaq))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || !!form.mediaCleanupPending))
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  const iconPreview = (item: FaqBenefit) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.svg)}`
  const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  function accept(value: FaqSettings) { Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await $fetch<FaqSettings>('/api/faq')) }
    catch { error.value = 'Не удалось загрузить вопросы. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = faqInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля вопросов и преимуществ'; return }
    saving.value = true
    try {
      accept(await adminFetch<FaqSettings>('/api/admin/faq', { method: 'PUT', body: parsed.data }))
      await refreshNuxtData('site-faq')
      if (form.mediaCleanupPending) error.value = 'Вопросы сохранены, но старые SVG не удалены из Storage. Нажмите «Сохранить» для повторной попытки.'
      else notice.value = 'Вопросы опубликованы. Изменения доступны на главной странице.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить вопросы. Повторите попытку.' }
    finally { saving.value = false }
  }
  function addQuestion() { if (!saving.value && form.questions.length < 30) form.questions.push({ id: newId('question'), question: '', answer: '' }) }
  function addBenefit() { if (!saving.value && form.benefits.length < 12) form.benefits.push({ id: newId('benefit'), svg: '', iconFilename: 'logo.svg', title: '', text: '' }) }
  function removeItem(list: 'questions' | 'benefits', index: number) { if (!saving.value) form[list].splice(index, 1) }
  function moveItem(list: 'questions' | 'benefits', index: number, delta: number) {
    const items = form[list], target = index + delta
    if (saving.value || target < 0 || target >= items.length) return
    const item = items[index]!
    items[index] = items[target]!
    items[target] = item
  }
  async function uploadSvg(event: Event, item: FaqBenefit) {
    const input = event.target as HTMLInputElement, file = input.files?.[0]
    if (!file || saving.value) return
    error.value = ''; notice.value = ''
    try { const selected = await media.readFile(file, { svgOnly: true }); item.svg = selected.text; item.iconFilename = selected.name }
    catch (e) { error.value = (e as Error).message }
    finally { input.value = '' }
  }
  function removeSvg(item: FaqBenefit) { if (!saving.value) { item.svg = ''; item.iconFilename = 'logo.svg' } }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения вопросов. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, iconPreview, load, save, addQuestion, addBenefit, removeItem, moveItem, uploadSvg, removeSvg, discard }
}
