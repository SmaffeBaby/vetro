import type { OtherObjectsSettings } from '#shared/types/other-objects'
import type { ObjectsCatalog } from '#shared/types/objects'
import { defaultOtherObjects } from '#shared/config/default-other-objects'
import { otherObjectsInputSchema } from '#shared/utils/other-objects'
export function useAdminOtherObjects() {
  const { adminFetch, contentFetch } = useAdminAuth()
  const objects = ref<ObjectsCatalog['objects']>([])
  const form = reactive<OtherObjectsSettings>(structuredClone(defaultOtherObjects))
  const loading = ref(true), saving = ref(false), loaded = ref(false)
  const error = ref(''), notice = ref(''), snapshot = ref('')
  const isDirty = computed(() => loaded.value && JSON.stringify(form) !== snapshot.value)
  const updatedLabel = computed(() => form.updatedAt ? new Date(form.updatedAt).toLocaleString('ru-RU') : 'Ещё не сохранено')
  function accept(value: OtherObjectsSettings) { Object.assign(form, structuredClone(value)); snapshot.value = JSON.stringify(form); loaded.value = true }
  async function load() {
    if (saving.value) return
    loading.value = true; error.value = ''; notice.value = ''
    try { const [catalog,settings] = await Promise.all([adminFetch<ObjectsCatalog>('/api/admin/objects'),contentFetch<OtherObjectsSettings>('/api/other-objects')]); objects.value = catalog.objects; accept(settings) }
    catch { error.value = 'Не удалось загрузить блок «Другие объекты». Проверьте подключение и миграцию базы данных.' }
    finally { loading.value = false }
  }
  async function save() {
    if (!loaded.value || saving.value) return
    error.value = ''; notice.value = ''
    const parsed = otherObjectsInputSchema.safeParse(form)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Проверьте поля карточек'; return }
    saving.value = true
    try {
      accept(await adminFetch<OtherObjectsSettings>('/api/admin/other-objects', { method: 'PUT', body: parsed.data }))
      notice.value = 'Блок «Другие объекты» опубликован для всех детальных страниц объектов.'
    } catch (e) { error.value = (e as { data?: { data?: { message?: string } } }).data?.data?.message || 'Не удалось сохранить блок «Другие объекты». Повторите попытку.' }
    finally { saving.value = false }
  }
  function toggleObject(id:string,value:boolean|'indeterminate'){if(saving.value)return;if(value===true&&!form.objectIds.includes(id))form.objectIds.push(id);else if(value===false)form.objectIds=form.objectIds.filter(item=>item!==id)}
  function moveObject(index:number,delta:number){const target=index+delta;if(saving.value||target<0||target>=form.objectIds.length)return;const id=form.objectIds.splice(index,1)[0]!;form.objectIds.splice(target,0,id)}
  function removeObject(id:string){if(!saving.value)form.objectIds=form.objectIds.filter(item=>item!==id)}
  function discard() { if (snapshot.value) accept(JSON.parse(snapshot.value)); error.value = ''; notice.value = '' }
  function warnUnsaved(event: BeforeUnloadEvent) { if (isDirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => { void load(); window.addEventListener('beforeunload', warnUnsaved) })
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
  const confirmLeave = () => !saving.value && (!isDirty.value || window.confirm('Есть несохранённые изменения. Покинуть страницу?'))
  onBeforeRouteLeave(confirmLeave)
  onBeforeRouteUpdate((to, from) => to.query.section === from.query.section || confirmLeave())
  return { form, loading, saving, loaded, error, notice, isDirty, updatedLabel, load, save, objects, toggleObject, moveObject, removeObject, discard }
}
