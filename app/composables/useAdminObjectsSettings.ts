import type { ObjectsSettings, ObjectsCatalog } from '#shared/types/objects'
import { defaultObjectsSettings } from '#shared/config/default-objects'
import { objectsSettingsInputSchema } from '#shared/utils/objects'
export function useAdminObjectsSettings() {
  const { adminFetch } = useAdminAuth()
  const objects = ref<ObjectsCatalog['objects']>([])
  const form = reactive<ObjectsSettings>(structuredClone(defaultObjectsSettings))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && JSON.stringify(form) !== snapshot.value)
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  function accept(value: ObjectsSettings) { Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { const catalog = await adminFetch<ObjectsCatalog>('/api/admin/objects'); objects.value = catalog.objects; accept(catalog.settings) }
    catch { error.value = 'Не удалось загрузить каталог объектов. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = objectsSettingsInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля карточек'; return }
    saving.value = true
    try {
      accept(await adminFetch<ObjectsSettings>('/api/admin/objects/settings', { method: 'PUT', body: parsed.data }))
      await refreshNuxtData('site-objects')
      notice.value = 'Каталог объектов опубликован.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить каталог объектов. Повторите попытку.' }
    finally { saving.value = false }
  }
  function addCategory() { if (!saving.value && form.categories.length < 20) form.categories.push({id:`category-${Date.now()}`,label:''}) }
  function removeCategory(index:number) { if (!saving.value && form.categories.length > 1) form.categories.splice(index,1) }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения каталога объектов. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, objects, addCategory, removeCategory, discard }
}
