import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import type { ServiceCard } from '#shared/types/services'
import type { ServicePriceSettings } from '#shared/types/services-prices'
import { createDefaultServicePrices } from '#shared/config/default-services-prices'
import { servicePricesInputSchema } from '#shared/utils/services-prices'
import { serviceDetailHref } from '#shared/utils/services-detail'
import { sortServiceCards } from '#shared/utils/services'

export function useAdminServicePrices(source: MaybeRefOrGetter<ServiceCard[]>) {
  const route = useRoute()
  const { adminFetch } = useAdminAuth()
  const cards = computed(() => sortServiceCards(toValue(source)))
  const options = computed(() => cards.value.map(card => ({ label: card.title, value: card.id })))
  const selectedId = computed(() => cards.value.find(card => card.id === route.query.service)?.id || cards.value[0]?.id || '')
  const form = reactive<ServicePriceSettings>(createDefaultServicePrices(''))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || form.revision === 0))
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  const previewHref = computed(() => selectedId.value ? serviceDetailHref(selectedId.value) : '/services')
  let requestId = 0
  function accept(value: ServicePriceSettings) {
    const { serviceId, title, description, buttonLabel, rows, revision, updatedAt } = value
    Object.assign(form, { serviceId, title, description, buttonLabel, rows, revision, updatedAt })
    snapshot.value = JSON.stringify(form); loaded.value = true
  }
  async function load() {
    if (saving.value) return
    const current = ++requestId, id = selectedId.value
    loading.value = true; loaded.value = false; error.value = ''; notice.value = ''
    if (!id) { loading.value = false; return }
    try {
      const value = await $fetch<ServicePriceSettings>(`/api/services-prices/${encodeURIComponent(id)}`)
      if (current === requestId) accept(value)
    } catch { if (current === requestId) error.value = 'Не удалось загрузить прайс-лист услуги. Проверьте подключение и миграцию базы данных.' }
    finally { if (current === requestId) loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value || form.serviceId !== selectedId.value) return
    error.value = ''; notice.value = ''
    const parsed = servicePricesInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля'; return }
    saving.value = true
    try {
      accept(await adminFetch<ServicePriceSettings>(`/api/admin/services-prices/${encodeURIComponent(form.serviceId)}`, { method: 'PUT', body: parsed.data }))
      await refreshNuxtData(`site-services-prices-${form.serviceId}`)
      notice.value = 'Стоимость услуг опубликована.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить прайс-лист. Повторите попытку.' }
    finally { saving.value = false }
  }
  async function selectService(id: string) { if (!saving.value && id !== selectedId.value) await navigateTo({ path: '/admin', query: { section: 'services-prices', service: id } }) }
  function addRow() { if (!saving.value && form.rows.length < 50) form.rows.push({ id: `price-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: '', price: '' }) }
  function removeRow(index: number) { if (!saving.value) form.rows.splice(index, 1) }
  function moveRow(index: number, delta: number) {
    const target = index + delta
    if (saving.value || target < 0 || target >= form.rows.length) return
    const row = form.rows.splice(index, 1)[0]!
    form.rows.splice(target, 0, row)
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  const confirmLeave = () => !saving.value && (!isDirty.value || window.confirm('Есть несохранённые изменения прайс-листа. Покинуть страницу?'))
  watch(selectedId, () => { void load() })
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => { requestId++; window.removeEventListener('beforeunload', warnUnsaved) })
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section && to.query.service === from.query.service || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, options, selectedId, previewHref, selectService, save, load, discard, addRow, removeRow, moveRow }
}
