import type { FooterColumn, FooterSettings } from '#shared/types/footer'
import { defaultFooter } from '#shared/config/default-footer'
import { footerInputSchema, sortFooterColumns } from '#shared/utils/footer'

export function useAdminFooter() {
  const { adminFetch } = useAdminAuth()
  const media = useMedia('Footer')
  const form = reactive<FooterSettings>(structuredClone(defaultFooter))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || !!form.mediaCleanupPending))
  const logoPreview = useHeaderLogo(() => form.logoSvg)
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  function accept(value: FooterSettings) { Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await $fetch<FooterSettings>('/api/footer')) }
    catch { error.value = 'Не удалось загрузить Footer. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = footerInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля футера'; return }
    saving.value = true
    try {
      accept(await adminFetch<FooterSettings>('/api/admin/footer', { method: 'PUT', body: parsed.data }))
      await refreshNuxtData('site-footer')
      if (form.mediaCleanupPending) error.value = 'Footer сохранён, но старый логотип не удалён из Storage. Нажмите «Сохранить» для повторной попытки.'
      else notice.value = 'Footer опубликован. Изменения доступны на сайте.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить Footer. Повторите попытку.' }
    finally { saving.value = false }
  }
  function addColumn() {
    if (saving.value || form.columns.length >= 8) return
    form.columns.push({ id: `column-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: '', sortOrder: Math.min(999999, Math.max(0, ...form.columns.map(item => item.sortOrder)) + 10), items: [] })
  }
  function removeColumn(index: number) { if (!saving.value) form.columns.splice(index, 1) }
  function arrangeColumns() { form.columns = sortFooterColumns(form.columns) }
  function moveColumn(index: number, delta: number) {
    const target = index + delta
    if (saving.value || target < 0 || target >= form.columns.length) return
    const column = form.columns.splice(index, 1)[0]!
    form.columns.splice(target, 0, column)
    form.columns.forEach((item: FooterColumn, i: number) => { item.sortOrder = (i + 1) * 10 })
  }
  async function uploadLogo(event: Event) {
    const input = event.target as HTMLInputElement, file = input.files?.[0]
    if (!file || saving.value) return
    error.value = ''; notice.value = ''
    try { const selected = await media.readFile(file, { svgOnly: true }); form.logoSvg = selected.text; form.logoFilename = selected.name }
    catch (e) { error.value = (e as Error).message }
    finally { input.value = '' }
  }
  function removeLogo() { form.logoSvg = ''; form.logoFilename = 'logo.svg' }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения Footer. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, logoPreview, updatedLabel, load, save, discard, addColumn, removeColumn, arrangeColumns, moveColumn, uploadLogo, removeLogo }
}
