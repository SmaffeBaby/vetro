import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import type { ServiceCard } from '#shared/types/services'
import type { ServiceRequestSettings } from '#shared/types/services-request'
import { createDefaultServiceRequest } from '#shared/config/default-services-request'
import { serviceRequestInputSchema } from '#shared/utils/services-request'
import { serviceDetailHref } from '#shared/utils/services-detail'
import { sortServiceCards } from '#shared/utils/services'

export function useAdminServiceRequest(source: MaybeRefOrGetter<ServiceCard[]>) {
  const route = useRoute()
  const { adminFetch, contentFetch } = useAdminAuth()
  const media = useMedia('Services/DetailServices/RequestCard')
  const cards = computed(() => sortServiceCards(toValue(source)))
  const options = computed(() => cards.value.map(card => ({ label: card.title, value: card.id })))
  const selectedId = computed(() => cards.value.find(card => card.id === route.query.service)?.id || cards.value[0]?.id || '')
  const form = reactive<ServiceRequestSettings>(createDefaultServiceRequest(''))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || form.revision === 0 || !!form.mediaCleanupPending))
  const logoPreview = computed(() => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(form.svg)}`)
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  const previewHref = computed(() => selectedId.value ? serviceDetailHref(selectedId.value) : '/services')
  let requestId = 0
  function accept(value: ServiceRequestSettings) {
    const { serviceId, title, description, note, buttonLabel, svg, imagePath, filename, revision, updatedAt, mediaCleanupPending } = value
    Object.assign(form, { serviceId, title, description, note, buttonLabel, svg, imagePath, filename, revision, updatedAt, mediaCleanupPending })
    snapshot.value = JSON.stringify(form); loaded.value = true
  }
  async function load() {
    if (saving.value) return
    const current = ++requestId, id = selectedId.value
    loading.value = true; loaded.value = false; error.value = ''; notice.value = ''
    if (!id) { loading.value = false; return }
    try {
      const value = await contentFetch<ServiceRequestSettings>(`/api/services-request/${encodeURIComponent(id)}`)
      if (current === requestId) accept(value)
    } catch { if (current === requestId) error.value = 'Не удалось загрузить блок заявки услуги. Проверьте подключение и миграцию базы данных.' }
    finally { if (current === requestId) loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value || form.serviceId !== selectedId.value) return
    error.value = ''; notice.value = ''
    const parsed = serviceRequestInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля'; return }
    saving.value = true
    try {
      accept(await adminFetch<ServiceRequestSettings>(`/api/admin/services-request/${encodeURIComponent(form.serviceId)}`, { method: 'PUT', body: parsed.data }))
      if (form.mediaCleanupPending) error.value = 'Блок заявки сохранён, но старый SVG не удалён. Нажмите «Сохранить» для повторной попытки.'
      else notice.value = 'блок заявки услуги опубликован.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить блок заявки. Повторите попытку.' }
    finally { saving.value = false }
  }
  async function selectService(id: string) { if (!saving.value && id !== selectedId.value) await navigateTo({ path: '/admin', query: { section: 'services-request', service: id } }) }
  async function uploadLogo(event: Event) {
    const input = event.target as HTMLInputElement, file = input.files?.[0]
    if (!file || saving.value) return
    error.value = ''; notice.value = ''
    try { const selected = await media.readFile(file, { svgOnly: true }); form.svg = selected.text; form.filename = selected.name }
    catch (e) { error.value = (e as Error).message }
    finally { input.value = '' }
  }
  function removeLogo() { if (!saving.value) { form.svg = ''; form.filename = 'logo.svg' } }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  const confirmLeave = () => !saving.value && (!isDirty.value || window.confirm('Есть несохранённые изменения блока заявки. Покинуть страницу?'))
  watch(selectedId, () => { void load() })
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => { requestId++; window.removeEventListener('beforeunload', warnUnsaved) })
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section && to.query.service === from.query.service || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, logoPreview, updatedLabel, options, selectedId, previewHref, selectService, save, load, discard, uploadLogo, removeLogo }
}
