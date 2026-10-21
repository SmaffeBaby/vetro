import type { ServiceIncludedSettings } from '#shared/types/services-included'
import { createDefaultServicesIncluded } from '#shared/config/default-services-included'
import { serviceIncludedInputSchema } from '#shared/utils/services-included'

export function useAdminServicesIncluded() {
  const route = useRoute()
  const { data: services } = useServices()
  const { adminFetch } = useAdminAuth()
  const options = computed(() => services.value.cards.map(card => ({ label: card.title, value: card.id })))
  const selectedId = computed(() => options.value.find(option => option.value === route.query.service)?.value || options.value[0]?.value || '')
  const form = reactive<ServiceIncludedSettings>(createDefaultServicesIncluded(''))
  const loading = ref(false), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && JSON.stringify(form) !== snapshot.value)
  let requestId = 0
  function accept(value: ServiceIncludedSettings) {
    Object.assign(form, structuredClone(value))
    snapshot.value = JSON.stringify(form)
    loaded.value = true
  }
  async function load() {
    const current = ++requestId, id = selectedId.value
    loaded.value = false; error.value = ''; notice.value = ''
    if (!id) return
    loading.value = true
    try {
      const value = await $fetch<ServiceIncludedSettings>(`/api/services-included/${encodeURIComponent(id)}`)
      if (current === requestId) accept(value)
    } catch { if (current === requestId) error.value = 'Не удалось загрузить пункты услуги. Попробуйте ещё раз.' }
    finally { if (current === requestId) loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value || form.serviceId !== selectedId.value) return
    error.value = ''; notice.value = ''
    const parsed = serviceIncludedInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля'; return }
    saving.value = true
    try {
      accept(await adminFetch<ServiceIncludedSettings>(`/api/admin/services-included/${encodeURIComponent(form.serviceId)}`, { method: 'PUT', body: parsed.data }))
      await refreshNuxtData(`site-services-included-${form.serviceId}`)
      notice.value = 'Пункты услуги и их страницы опубликованы.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить изменения.' }
    finally { saving.value = false }
  }
  function addItem() {
    form.items.push({ id: `item-${crypto.randomUUID().slice(0, 8)}`, title: '', text: '', detailTitle: '', detailText: '', body: '', buttonLabel: 'Оставить заявку' })
  }
  function moveItem(index: number, direction: number) {
    const target = index + direction
    if (target < 0 || target >= form.items.length) return
    const item = form.items.splice(index, 1)[0]!
    form.items.splice(target, 0, item)
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  const confirmLeave = () => !saving.value && (!isDirty.value || window.confirm('Есть несохранённые изменения пунктов услуги. Покинуть страницу?'))
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  async function selectService(id: string) { if (!saving.value) await navigateTo({ path: '/admin', query: { section: 'services-included', service: id } }) }
  watch(selectedId, () => { void load() })
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => { requestId++; window.removeEventListener('beforeunload', warnUnsaved) })
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section && to.query.service === from.query.service || confirmLeave())
  return { form, options, selectedId, loading, saving, loaded, error, notice, isDirty, load, save, discard, selectService, addItem, moveItem }
}
