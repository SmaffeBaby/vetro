import type { HeaderSettings } from '#shared/types/header'
import { defaultHeader } from '#shared/config/default-header'
import { headerInputSchema } from '#shared/utils/header'

export function useAdminHeader() {
  const { adminFetch } = useAdminAuth()
  const media = useMedia('Header')
  const form = reactive<HeaderSettings>(structuredClone(defaultHeader))
  const loading = ref(true)
  const saving = ref(false)
  const error = ref('')
  const notice = ref('')
  const snapshot = ref('')
  const loaded = ref(false)
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || form.mediaCleanupPending === true))
  const logoPreview = useHeaderLogo(() => form.logoSvg)
  const updatedLabel = computed(() => form.updatedAt ? new Intl.DateTimeFormat('ru', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(form.updatedAt)) : 'Ещё не сохранено')

  function accept(value: HeaderSettings) { loaded.value = true; Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form) }
  function message(e: unknown): string {
    const failure = e as { statusCode?: number; data?: { data?: { message?: string } } }
    return failure.data?.data?.message || (failure.statusCode === 401 ? 'Сессия завершилась. Выйдите и войдите снова.' : 'Не удалось сохранить изменения. Попробуйте ещё раз.')
  }
  async function load() {
    loading.value = true
    error.value = ''
    try { accept(await $fetch<HeaderSettings>('/api/header')) } catch { error.value = 'Не удалось загрузить настройки хедера.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = headerInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message ?? 'Проверьте поля'; return }
    saving.value = true
    try {
      accept(await adminFetch<HeaderSettings>('/api/admin/header', { method: 'PUT', body: parsed.data }))
      await refreshNuxtData('site-header')
      if (form.mediaCleanupPending) error.value = 'Хедер сохранён, но Storage не удалил старый файл. Нажмите «Сохранить» для повторной попытки.'
      else notice.value = 'Хедер опубликован. Изменения уже доступны на сайте.'
    } catch (e) { error.value = message(e) }
    finally { saving.value = false }
  }
  function addItem() {
    if (form.menuItems.length >= 12) return
    form.menuItems.push({ id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, label: '', href: '/' })
  }
  function removeItem(index: number) { form.menuItems.splice(index, 1) }
  function moveItem(index: number, delta: number) {
    const target = index + delta
    if (target < 0 || target >= form.menuItems.length) return
    const item = form.menuItems.splice(index, 1)[0]!
    form.menuItems.splice(target, 0, item)
  }
  async function uploadLogo(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    if (saving.value) { input.value = ''; return }
    error.value = ''; notice.value = ''
    try {
      const selected = await media.readFile(file, { svgOnly: true })
      form.logoSvg = selected.text
      form.logoFilename = selected.name
    } catch (e) { error.value = (e as Error).message }
    finally { input.value = '' }
  }
  function removeLogo() {
    form.logoSvg = ''
    form.logoFilename = 'logo.svg'
    error.value = ''; notice.value = ''
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value && !loading.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  onBeforeRouteLeave(() => !isDirty.value || window.confirm('Есть несохранённые изменения. Покинуть страницу?'))
  return { form, loading, saving, error, notice, isDirty, logoPreview, updatedLabel, save, load, discard, addItem, removeItem, moveItem, uploadLogo, removeLogo }
}
