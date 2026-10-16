import type { ServicesHelpCardSettings } from '#shared/types/services-help-card'
import { defaultServicesHelpCard } from '#shared/config/default-services-help-card'
import { servicesHelpCardInputSchema } from '#shared/utils/services-help-card'

export function useAdminServicesHelpCard() {
  const { adminFetch } = useAdminAuth()
  const media = useMedia('Services/HelpCard')
  const form = reactive<ServicesHelpCardSettings>(structuredClone(defaultServicesHelpCard))
  const loading = ref(true)
  const saving = ref(false)
  const error = ref('')
  const notice = ref('')
  const snapshot = ref('')
  const loaded = ref(false)
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || form.mediaCleanupPending === true))
  const logoPreview = computed(() => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(form.svg)}`)
  const updatedLabel = computed(() => form.updatedAt ? new Intl.DateTimeFormat('ru', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(form.updatedAt)) : 'Ещё не сохранено')

  function accept(value: ServicesHelpCardSettings) { loaded.value = true; Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form) }
  function message(e: unknown): string {
    const failure = e as { statusCode?: number; data?: { data?: { message?: string } } }
    return failure.data?.data?.message || (failure.statusCode === 401 ? 'Сессия завершилась. Выйдите и войдите снова.' : 'Не удалось сохранить изменения. Попробуйте ещё раз.')
  }
  async function load() {
    if (saving.value) return
    loading.value = true
    error.value = ''
    try { accept(await $fetch<ServicesHelpCardSettings>('/api/services-help-card')) } catch { error.value = 'Не удалось загрузить HelpCard.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = servicesHelpCardInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message ?? 'Проверьте поля'; return }
    saving.value = true
    try {
      accept(await adminFetch<ServicesHelpCardSettings>('/api/admin/services-help-card', { method: 'PUT', body: parsed.data }))
      await refreshNuxtData('site-services-help-card')
      if (form.mediaCleanupPending) error.value = 'HelpCard сохранён, но Storage не удалил старый файл. Нажмите «Сохранить» для повторной попытки.'
      else notice.value = 'HelpCard опубликован. Изменения уже доступны на сайте.'
    } catch (e) { error.value = message(e) }
    finally { saving.value = false }
  }
  async function uploadLogo(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    if (saving.value) { input.value = ''; return }
    error.value = ''; notice.value = ''
    try {
      const selected = await media.readFile(file, { svgOnly: true })
      form.svg = selected.text
      form.filename = selected.name
    } catch (e) { error.value = (e as Error).message }
    finally { input.value = '' }
  }
  function removeLogo() {
    form.svg = ''
    form.filename = 'logo.svg'
    error.value = ''; notice.value = ''
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value && !loading.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, logoPreview, updatedLabel, save, load, discard, uploadLogo, removeLogo }
}
