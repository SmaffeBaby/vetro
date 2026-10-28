import type { LicenseSettings } from '#shared/types/license'
import { defaultLicense } from '#shared/config/default-license'
import { licenseInputSchema, licenseImageTypes } from '#shared/utils/license'

export function useAdminLicense() {
  const { adminFetch, contentFetch } = useAdminAuth()
  const media = useMedia('License')
  const form = reactive<LicenseSettings>(structuredClone(defaultLicense))
  const loading = ref(true)
  const saving = ref(false)
  const loaded = ref(false)
  const error = ref('')
  const notice = ref('')
  const snapshot = ref('')
  const selectedFile = shallowRef<File | null>(null)
  const localPreview = ref('')
  const imageRemoved = ref(false)
  const imagePreview = computed(() => imageRemoved.value ? '' : localPreview.value || (form.imagePath ? media.url(form.imagePath) : ''))
  const isDirty = computed(() => loaded.value && (JSON.stringify(form) !== snapshot.value || !!selectedFile.value || imageRemoved.value || !!form.mediaCleanupPending))
  function clearSelection() {
    localPreview.value = ''; selectedFile.value = null; imageRemoved.value = false
  }
  function accept(value: LicenseSettings) {
    clearSelection(); Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true
  }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { accept(await contentFetch<LicenseSettings>('/api/license')) }
    catch { error.value = 'Не удалось загрузить лицензию. Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = licenseInputSchema.safeParse({ ...form, removeImage: imageRemoved.value })
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message ?? 'Проверьте поля'; return }
    const body = new FormData()
    body.set('settings', JSON.stringify(parsed.data))
    if (selectedFile.value) body.set('image', selectedFile.value)
    saving.value = true
    try {
      accept(await adminFetch<LicenseSettings>('/api/admin/license', { method: 'PUT', body }))
      if (form.mediaCleanupPending) error.value = 'Лицензия сохранена, но старое фото не удалено из Storage. Нажмите «Сохранить» для повторной попытки.'
      else notice.value = 'Лицензия опубликована. Изменения доступны на главной странице.'
    } catch (e) {
      const failure = e as { data?: { data?: { message?: string } }; message?: string }
      error.value = failure.data?.data?.message || 'Не удалось сохранить лицензию. Проверьте соединение и повторите попытку.'
    } finally { saving.value = false }
  }
  async function selectImage(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file || saving.value) return
    error.value = ''; notice.value = ''
    try {
      if (!licenseImageTypes.includes(file.type)) throw new Error('Выберите фото PNG, JPEG, WebP или AVIF.')
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
  const confirmLeave = () => !isDirty.value || window.confirm('Есть несохранённые изменения лицензии. Покинуть страницу?')
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, imagePreview, selectedFile, load, save, selectImage, removeImage, discard }
}
