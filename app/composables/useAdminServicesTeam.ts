import type { TeamCard } from '#shared/types/services-team'
import { mediaUrl } from '#shared/utils/media'
import type { ServicesTeamSettings } from '#shared/types/services-team'
import { defaultServicesTeam } from '#shared/config/default-services-team'
import { servicesTeamInputSchema, sortTeamCards } from '#shared/utils/services-team'
export function useAdminServicesTeam() {
  const { adminFetch } = useAdminAuth()
  const media = useMedia('Services/DetailServices/Team')
  const files = shallowReactive<Record<string, File>>({})
  const previews = reactive<Record<string, string>>({})
  const removed = reactive<Record<string, boolean>>({})
  const form = reactive<ServicesTeamSettings>(structuredClone(defaultServicesTeam))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || Object.keys(files).length > 0 || Object.values(removed).some(Boolean) || !!form.mediaCleanupPending))
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  function accept(value: ServicesTeamSettings) { clearFiles(); Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await $fetch<ServicesTeamSettings>('/api/services-team')) }
    catch { error.value = 'Не удалось загрузить команду. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = servicesTeamInputSchema.safeParse({ ...form, cards: form.cards.map(card => ({...card, removeImage: !!removed[card.id]})) })
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля карточек'; return }
    const body = new FormData()
    body.set('settings', JSON.stringify(parsed.data))
    for (const card of form.cards) if (files[card.id]) body.set(`image:${card.id}`, files[card.id]!)
    saving.value = true
    try {
      accept(await adminFetch<ServicesTeamSettings>('/api/admin/services-team', { method: 'PUT', body }))
      await refreshNuxtData('site-services-team')
      if (form.mediaCleanupPending) error.value = 'Команда сохранена. Старые фото не удалены; сохраните ещё раз для повторной попытки.'
      else notice.value = 'Команда опубликована для всех детальных страниц услуг.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить команду. Повторите попытку.' }
    finally { saving.value = false }
  }
  function addCard() {
    if (saving.value || form.cards.length >= 24) return
    form.cards.push({ id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, sortOrder: Math.min(999999, Math.max(0, ...form.cards.map(c => c.sortOrder)) + 10), name: '', position: '', description: '', imagePath: null, imageFilename: '' })
  }
  function removeCard(index: number) { if (!saving.value) { const card = form.cards[index]; if (card) clearFile(card.id); form.cards.splice(index, 1) } }
  function arrangeCards() { if (!saving.value) form.cards = sortTeamCards(form.cards) }
  function clearFile(id: string) { if (previews[id]) URL.revokeObjectURL(previews[id]!); delete previews[id]; delete files[id]; delete removed[id] }
  function clearFiles() { for (const id of new Set([...Object.keys(files), ...Object.keys(previews), ...Object.keys(removed)])) clearFile(id) }
  function imagePreview(card: TeamCard) { return removed[card.id] ? '' : previews[card.id] || (card.imagePath ? mediaUrl(card.imagePath) : '') }
  async function selectImage(event: Event, card: TeamCard) {
    const input = event.target as HTMLInputElement, file = input.files?.[0]
    if (!file || saving.value) return
    error.value = ''; notice.value = ''
    try {
      if (file.type !== 'image/png') throw new Error('Выберите фото PNG до 5 МБ.')
      await media.readFile(file)
      clearFile(card.id); files[card.id] = file; previews[card.id] = URL.createObjectURL(file)
    } catch (e) { error.value = (e as Error).message }
    finally { input.value = '' }
  }
  function removeImage(card: TeamCard) { if (!saving.value) { clearFile(card.id); removed[card.id] = !!card.imagePath } }
  function moveCard(index: number, delta: number) {
    const target = index + delta
    if (saving.value || target < 0 || target >= form.cards.length) return
    const card = form.cards.splice(index, 1)[0]!
    form.cards.splice(target, 0, card)
    form.cards.forEach((c,i) => { c.sortOrder = (i+1)*10 })
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => { clearFiles(); window.removeEventListener('beforeunload', warnUnsaved) })
  const confirmLeave = () => !saving.value && (!isDirty.value || window.confirm('Есть несохранённые изменения команды. Покинуть страницу?'))
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, addCard, removeCard, moveCard, arrangeCards, imagePreview, selectImage, removeImage, discard }
}
