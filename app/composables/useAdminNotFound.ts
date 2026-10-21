import type { NotFoundSettings } from '#shared/types/not-found'
import { defaultNotFound } from '#shared/config/default-not-found'
import { notFoundInputSchema } from '#shared/utils/not-found'
export function useAdminNotFound() {
  const { adminFetch } = useAdminAuth()
  const form = reactive<NotFoundSettings>(structuredClone(defaultNotFound))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && JSON.stringify(form) !== snapshot.value)
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  function accept(value: NotFoundSettings) { Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true }
  async function load() {
    if (saving.value) return
    loading.value = true; loaded.value = false; error.value = ''; notice.value = ''
    try { accept(await $fetch<NotFoundSettings>('/api/not-found')) }
    catch { error.value = 'Не удалось загрузить страницу 404. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = notFoundInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля карточек'; return }
    saving.value = true
    try {
      accept(await adminFetch<NotFoundSettings>('/api/admin/not-found', { method: 'PUT', body: parsed.data }))
      await refreshNuxtData('site-not-found')
      notice.value = 'Страница 404 опубликована.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить страницу 404. Повторите попытку.' }
    finally { saving.value = false }
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !saving.value && (!isDirty.value || window.confirm('Есть несохранённые изменения страницы 404. Покинуть страницу?'))
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, discard }
}
