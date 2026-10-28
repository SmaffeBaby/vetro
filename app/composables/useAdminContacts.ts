import type { ContactItem, ContactSocial, ContactsSettings } from '#shared/types/contacts'
import { defaultContacts } from '#shared/config/default-contacts'
import { contactsInputSchema } from '#shared/utils/contacts'

export function useAdminContacts(kind: 'home' | 'page' = 'home') {
  const endpoint = kind === 'page' ? 'contacts-page' : 'contacts'
  const { adminFetch, contentFetch } = useAdminAuth()
  const media = useMedia(kind === 'page' ? 'ContactsPage' : 'Contacts')
  const form = reactive<ContactsSettings>(structuredClone(defaultContacts))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || !!form.mediaCleanupPending))
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  const iconPreview = (item: ContactItem | ContactSocial) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.svg)}`
  function accept(value: ContactsSettings) { Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await contentFetch<ContactsSettings>(`/api/${endpoint}`)) }
    catch { error.value = 'Не удалось загрузить контакты. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = contactsInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля контактов'; return }
    saving.value = true
    try {
      accept(await adminFetch<ContactsSettings>(`/api/admin/${endpoint}`, { method: 'PUT', body: parsed.data }))
      if (form.mediaCleanupPending) error.value = 'Контакты сохранены, но старые SVG не удалены из Storage. Нажмите «Сохранить» для повторной попытки.'
      else notice.value = kind === 'page' ? 'Контакты опубликованы на странице /contacts.' : 'Контакты опубликованы на главной странице.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить контакты. Повторите попытку.' }
    finally { saving.value = false }
  }
  async function uploadSvg(event: Event, item: ContactItem | ContactSocial) {
    const input = event.target as HTMLInputElement, file = input.files?.[0]
    if (!file || saving.value) return
    error.value = ''; notice.value = ''
    try { const selected = await media.readFile(file, { svgOnly: true }); item.svg = selected.text; item.iconFilename = selected.name }
    catch (e) { error.value = (e as Error).message }
    finally { input.value = '' }
  }
  function removeSvg(item: ContactItem | ContactSocial) { if (!saving.value) { item.svg = ''; item.iconFilename = `${item.id}.svg` } }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения контактов. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, iconPreview, load, save, uploadSvg, removeSvg, discard }
}
