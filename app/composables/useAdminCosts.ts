import type { CostField, CostsSettings } from '#shared/types/costs'
import { defaultCosts } from '#shared/config/default-costs'
import { costsInputSchema } from '#shared/utils/costs'
export function useAdminCosts() {
  const { adminFetch } = useAdminAuth()
  const form = reactive<CostsSettings>(structuredClone(defaultCosts))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && JSON.stringify(form) !== snapshot.value)
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  function accept(value: CostsSettings) { Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await $fetch<CostsSettings>('/api/costs')) }
    catch { error.value = 'Не удалось загрузить стоимость. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = costsInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля списков'; return }
    saving.value = true
    try {
      accept(await adminFetch<CostsSettings>('/api/admin/costs', { method: 'PUT', body: parsed.data }))
      await refreshNuxtData('site-costs')
      notice.value = 'Стоимость опубликована. Изменения доступны на главной странице.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить стоимость. Повторите попытку.' }
    finally { saving.value = false }
  }
  function addField() { if (!saving.value && form.fields.length < 12) form.fields.push({ id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, label: '', options: [''] }) }
  function removeField(index: number) { if (!saving.value && form.fields.length > 1) form.fields.splice(index, 1) }
  function moveField(index: number, delta: number) {
    const target = index + delta
    if (saving.value || target < 0 || target >= form.fields.length) return
    const item = form.fields.splice(index, 1)[0]!
    form.fields.splice(target, 0, item)
  }
  function addOption(field: CostField) { if (!saving.value && field.options.length < 50) field.options.push('') }
  function removeOption(field: CostField, index: number) { if (!saving.value && field.options.length > 1) field.options.splice(index, 1) }
  function moveOption(field: CostField, index: number, delta: number) {
    const target = index + delta
    if (saving.value || target < 0 || target >= field.options.length) return
    const item = field.options.splice(index, 1)[0]!
    field.options.splice(target, 0, item)
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения стоимости. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, addField, removeField, moveField, addOption, removeOption, moveOption, discard }
}
