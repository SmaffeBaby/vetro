import type { AboutHeroSettings } from '#shared/types/about-hero'
import { defaultAboutHero } from '#shared/config/default-about-hero'
import { aboutHeroImageUrl } from '#shared/utils/about-hero'
import { aboutHeroInputSchema } from '#shared/utils/about-hero'

export function useAdminAboutHero() {
  const { adminFetch, contentFetch } = useAdminAuth()
  const media = useMedia('AboutHero')
  const form = reactive<AboutHeroSettings>(structuredClone(defaultAboutHero))
  const loading = ref(true)
  const saving = ref(false)
  const loaded = ref(false)
  const error = ref('')
  const notice = ref('')
  const snapshot = ref('')
  const selectedFile = shallowRef<File | null>(null)
  const localPreview = ref('')
  const imageRemoved = ref(false)
  const imagePreview = computed(() => imageRemoved.value ? '' : localPreview.value || (form.imagePath ? aboutHeroImageUrl(form.imagePath) : ''))
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || !!selectedFile.value || imageRemoved.value || !!form.mediaCleanupPending))
  function clearSelection() {
    localPreview.value = ''; selectedFile.value = null; imageRemoved.value = false
  }
  function accept(value: AboutHeroSettings) {
    clearSelection(); Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true
  }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await contentFetch<AboutHeroSettings>('/api/about-hero')) }
    catch { error.value = 'Не удалось загрузить Hero. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = aboutHeroInputSchema.safeParse({ ...form, removeImage: imageRemoved.value })
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message ?? 'Проверьте поля'; return }
    const body = new FormData()
    body.set('settings', JSON.stringify(parsed.data))
    if (selectedFile.value) body.set('image', selectedFile.value)
    saving.value = true
    try {
      accept(await adminFetch<AboutHeroSettings>('/api/admin/about-hero', { method: 'PUT', body }))
      if (form.mediaCleanupPending) error.value = 'Hero сохранён, но старое фото не удалено из Storage. Нажмите «Сохранить» для повторной попытки.'
      else notice.value = 'Hero опубликован. Изменения доступны на странице /about.'
    } catch (e) {
      const failure = e as { data?: { data?: { message?: string } }; message?: string }
      error.value = failure.data?.data?.message || 'Не удалось сохранить Hero. Проверьте соединение и повторите попытку.'
    } finally { saving.value = false }
  }
  async function selectImage(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file || saving.value) return
    error.value = ''; notice.value = ''
    try {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Выберите PNG, JPEG или WebP.')
      await media.readFile(file)
      const preview = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('Не удалось прочитать изображение.'))
        reader.readAsDataURL(file)
      })
      clearSelection(); selectedFile.value = file; localPreview.value = preview
    } catch (e) { error.value = (e as Error).message }
    finally { input.value = '' }
  }
  function removeImage() { clearSelection(); imageRemoved.value = !!form.imagePath; error.value = ''; notice.value = '' }
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => { clearSelection(); window.removeEventListener('beforeunload', warnUnsaved) })
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения Hero. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, imagePreview, selectedFile, load, save, selectImage, removeImage, discard }
}
