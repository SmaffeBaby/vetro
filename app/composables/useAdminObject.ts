import type {ObjectsCatalog,SiteObject} from '#shared/types/objects'
import {createEmptyObject} from '#shared/config/default-objects'
import {objectInputSchema,objectHref} from '#shared/utils/objects'
import {mediaUrl} from '#shared/utils/media'
export function useAdminObject(){
 const route=useRoute(),{adminFetch}=useAdminAuth(),media=useMedia('Objects/Photos')
 const catalog=ref<ObjectsCatalog|null>(null),form=reactive<SiteObject>(createEmptyObject())
 const loading=ref(true),saving=ref(false),loaded=ref(false),error=ref(''),notice=ref(''),snapshot=ref('')
 const file=shallowRef<File|null>(null),preview=ref(''),removed=ref(false)
 const isDirty=computed(()=>loaded.value&&(JSON.stringify(form)!==snapshot.value||!!file.value||removed.value||!!form.mediaCleanupPending))
 const imagePreview=computed(()=>removed.value?'':preview.value||(form.imagePath?mediaUrl(form.imagePath):''))
 const options=computed(()=>catalog.value?.objects.map(o=>({label:o.title,value:o.id}))||[])
 const categoryOptions=computed(()=>catalog.value?.settings.categories.map(c=>({label:c.label,value:c.id}))||[])
 const previewHref=computed(()=>form.id?objectHref(form.id):'/objects')
 let requestId=0
 function clearFile(){if(preview.value)URL.revokeObjectURL(preview.value);preview.value='';file.value=null;removed.value=false}
 function accept(value:SiteObject){clearFile();Object.assign(form,structuredClone(value));snapshot.value=JSON.stringify(form);loaded.value=true}
 async function load(){
  if(saving.value)return
  const current=++requestId;loading.value=true;error.value='';notice.value='';loaded.value=false
  try{
   const value=await adminFetch<ObjectsCatalog>('/api/admin/objects')
   if(current!==requestId)return
   catalog.value=value
   if(route.query.create==='1'){const empty=createEmptyObject();empty.categoryId=value.settings.categories[0]?.id||'';accept(empty)}
   else{const object=value.objects.find(o=>o.id===route.query.object)||(route.query.object?null:value.objects[0]);if(object)accept(object);else if(route.query.object)error.value='Объект не найден';else {const empty=createEmptyObject();empty.categoryId=value.settings.categories[0]?.id||'';accept(empty)}}
  }catch{if(current===requestId)error.value='Не удалось загрузить объекты. Проверьте подключение и миграцию базы.'}
  finally{if(current===requestId)loading.value=false}
 }
 async function save(){
  if(!loaded.value||saving.value)return
  error.value='';notice.value=''
  const parsed=objectInputSchema.safeParse({...form,removeImage:removed.value})
  if(!parsed.success){error.value=parsed.error.issues[0]?.message||'Проверьте поля';return}
  const body=new FormData();body.set('settings',JSON.stringify(parsed.data));if(file.value)body.set('image',file.value)
  let savedId:string|undefined
  saving.value=true
  try{
   const saved=await adminFetch<SiteObject>(`/api/admin/objects/${encodeURIComponent(parsed.data.id)}`,{method:'PUT',body});accept(saved);savedId=saved.id
   if(catalog.value){const index=catalog.value.objects.findIndex(o=>o.id===saved.id);if(index<0)catalog.value.objects.push(saved);else catalog.value.objects[index]=saved}
   notice.value=saved.mediaCleanupPending?'Объект сохранён. Сохраните ещё раз для повторного удаления старого фото.':saved.published?'Объект опубликован.':'Объект сохранён и скрыт из каталога.'
  }catch(e){error.value=(e as {data?:{data?:{message?:string}}}).data?.data?.message||'Не удалось сохранить объект. Повторите попытку.'}
  finally{saving.value=false}
  if(savedId&&route.query.create==='1')await navigateTo({path:'/admin',query:{section:'objects-detail',object:savedId}},{replace:true})
 }
 async function selectObject(id:string){if(!saving.value)await navigateTo({path:'/admin',query:{section:'objects-detail',object:id}})}
 async function createObject(){if(!saving.value)await navigateTo({path:'/admin',query:{section:'objects-detail',create:'1'}})}
 async function selectImage(event:Event){const input=event.target as HTMLInputElement,selected=input.files?.[0];if(!selected||saving.value)return;error.value='';try{if(selected.type!=='image/png')throw new Error('Выберите PNG до 5 МБ.');await media.readFile(selected);clearFile();file.value=selected;preview.value=URL.createObjectURL(selected)}catch(e){error.value=(e as Error).message}finally{input.value=''}}
 function removeImage(){if(!saving.value){clearFile();removed.value=!!form.imagePath}}
 function discard(){if(snapshot.value)accept(JSON.parse(snapshot.value));error.value='';notice.value=''}
 const confirmLeave=()=>!saving.value&&(!isDirty.value||window.confirm('Есть несохранённые изменения объекта. Покинуть страницу?'))
 function warn(event:BeforeUnloadEvent){if(isDirty.value){event.preventDefault();event.returnValue=''}}
 watch(()=>[route.query.object,route.query.create],()=>void load())
 onMounted(()=>{void load();window.addEventListener('beforeunload',warn)})
 onBeforeUnmount(()=>{requestId++;clearFile();window.removeEventListener('beforeunload',warn)})
 onBeforeRouteLeave(confirmLeave)
 onBeforeRouteUpdate((to,from)=>to.query.section===from.query.section&&to.query.object===from.query.object&&to.query.create===from.query.create||confirmLeave())
 return{form,catalog,options,categoryOptions,previewHref,loading,saving,loaded,error,notice,isDirty,imagePreview,load,save,discard,selectObject,createObject,selectImage,removeImage}
}
