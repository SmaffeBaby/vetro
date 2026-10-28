import { defaultAboutProject } from '#shared/config/default-about-project'
import { defaultObjectsRequestCard } from '#shared/config/default-objects-request-card'
import { defaultObjectsNextObject } from '#shared/config/default-objects-next-object'
import type { ServicesHelpCardSettings } from '#shared/types/services-help-card'
import { defaultServicesHelpCard } from '#shared/config/default-services-help-card'
import { servicesHelpCardInputSchema } from '#shared/utils/services-help-card'

export function useAdminServicesHelpCard(kind: 'services' | 'objects' | 'objects-detail' | 'about-project' = 'services') {
  const configs = {
    'about-project': { api:'about-project', label:'Обсудить ваш проект', mediaComponent:'AboutProject', defaults:defaultAboutProject, description:'Блок заявки под благодарственными письмами на странице «О компании».' },
    services: { api:'services-help-card', label:'HelpCard', mediaComponent:'Services/HelpCard', defaults:defaultServicesHelpCard, description:'Блок консультации под карточками на странице услуг.' },
    objects: { api:'objects-next-object', label:'Следующий объект', mediaComponent:'Objects/NextObject', defaults:defaultObjectsNextObject, description:'Блок заявки под карточками объектов. Настройки независимы от страницы услуг.' },
    'objects-detail': { api:'objects-request-card', label:'Оставить заявку', mediaComponent:'Objects/RequestCard', defaults:defaultObjectsRequestCard, description:'Общий блок для всех детальных страниц объектов. Настройки независимы от каталога объектов и страницы услуг.' }
  } as const
  const { api, label, mediaComponent, defaults, description } = configs[kind]
  const editorTitle = label, mediaDirectory = mediaComponent.replaceAll('/', ' / ')
  const { adminFetch, contentFetch } = useAdminAuth()
  const media = useMedia(mediaComponent)
  const form = reactive<ServicesHelpCardSettings>(structuredClone(defaults))
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
    try { accept(await contentFetch<ServicesHelpCardSettings>(`/api/${api}`)) } catch { error.value = `Не удалось загрузить ${label}.` }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = servicesHelpCardInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message ?? 'Проверьте поля'; return }
    saving.value = true
    try {
      accept(await adminFetch<ServicesHelpCardSettings>(`/api/admin/${api}`, { method: 'PUT', body: parsed.data }))
      if (form.mediaCleanupPending) error.value = `${label}: настройки сохранены, но старый файл не удалён. Сохраните ещё раз для повторной попытки.`
      else notice.value = `${label}: изменения опубликованы.`
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
    if (saving.value) return
    form.svg = ''
    form.filename = 'logo.svg'
    error.value = ''; notice.value = ''
  }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value && !loading.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !saving.value && (!isDirty.value || window.confirm('Есть несохранённые изменения. Покинуть страницу?'))
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { editorTitle, mediaDirectory, description, form, loading, saving, loaded, error, notice, isDirty, logoPreview, updatedLabel, save, load, discard, uploadLogo, removeLogo }
}
