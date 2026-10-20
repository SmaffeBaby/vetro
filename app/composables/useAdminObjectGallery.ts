import type {ObjectGallerySettings,ObjectPhoto} from '#shared/types/object-gallery'
import type {ObjectsCatalog} from '#shared/types/objects'
import {createDefaultObjectGallery} from '#shared/config/default-object-gallery'
import {objectGalleryInputSchema,GALLERY_IMAGE_TYPES,GALLERY_UPLOAD_MAX_BYTES} from '#shared/utils/object-gallery'
import {mediaUrl} from '#shared/utils/media'
import {objectHref} from '#shared/utils/objects'
export function useAdminObjectGallery(){
 const route=useRoute(),{adminFetch}=useAdminAuth(),media=useMedia('Objects/Gallery')
 const objects=ref<ObjectsCatalog['objects']>([]),form=reactive<ObjectGallerySettings>(createDefaultObjectGallery(''))
 const files=shallowReactive<Record<string,File>>({}),previews=reactive<Record<string,string>>({})
 const loading=ref(true),saving=ref(false),loaded=ref(false),error=ref(''),notice=ref(''),snapshot=ref('')
 const isDirty=computed(()=>loaded.value&&(JSON.stringify(form)!==snapshot.value||Object.keys(files).length>0||!!form.mediaCleanupPending))
 const options=computed(()=>objects.value.map(o=>({label:o.title+(o.published?'':' (скрыт)'),value:o.id})))
 const selectedId=computed(()=>typeof route.query.object==='string'?route.query.object:objects.value[0]?.id||'')
 const previewHref=computed(()=>selectedId.value?objectHref(selectedId.value):'/objects')
 let requestId=0
 function clearFile(id:string){if(previews[id])URL.revokeObjectURL(previews[id]!);delete previews[id];delete files[id]}
 function clearFiles(){Object.keys(files).forEach(clearFile)}
 function accept(value:ObjectGallerySettings){clearFiles();Object.assign(form,structuredClone(value));snapshot.value=JSON.stringify(form);loaded.value=true}
 async function load(){
  if(saving.value)return
  const current=++requestId;loading.value=true;loaded.value=false;error.value='';notice.value=''
  try{const catalog=await adminFetch<ObjectsCatalog>('/api/admin/objects');if(current!==requestId)return;objects.value=catalog.objects;const id=selectedId.value;if(!id)return;if(!objects.value.some(o=>o.id===id)){error.value='Объект не найден';return}const value=await adminFetch<ObjectGallerySettings>(`/api/admin/object-gallery/${encodeURIComponent(id)}`);if(current===requestId)accept(value)}
  catch{if(current===requestId)error.value='Не удалось загрузить фотографии. Проверьте подключение и миграцию базы.'}finally{if(current===requestId)loading.value=false}
 }
 async function save(){
  if(!loaded.value||saving.value||form.objectId!==selectedId.value)return
  error.value='';notice.value='';const parsed=objectGalleryInputSchema.safeParse(form)
  if(!parsed.success){error.value=parsed.error.issues[0]?.message||'Проверьте фотографии';return}
  const body=new FormData();body.set('settings',JSON.stringify(parsed.data));Object.entries(files).forEach(([id,file])=>body.set(`image:${id}`,file))
  saving.value=true
  try{accept(await adminFetch<ObjectGallerySettings>(`/api/admin/object-gallery/${encodeURIComponent(form.objectId)}`,{method:'PUT',body}));await refreshNuxtData(`site-object-gallery-${form.objectId}`);if(form.mediaCleanupPending)error.value='Фотографии сохранены, но старые файлы пока не удалены. Повторите сохранение.';else notice.value='Фотографии выбранного объекта сохранены.'}
  catch(e){error.value=(e as {data?:{data?:{message?:string}}}).data?.data?.message||'Не удалось сохранить фотографии. Повторите попытку.'}finally{saving.value=false}
 }
 async function selectObject(id:string){if(!saving.value&&id!==selectedId.value)await navigateTo({path:'/admin',query:{section:'objects-gallery',object:id}})}
 async function chooseFiles(event:Event,photo?:ObjectPhoto){
  const input=event.target as HTMLInputElement,chosen=Array.from(input.files||[]);input.value=''
  if(saving.value||!chosen.length)return
  error.value='';notice.value=''
  try{
   if(!photo&&form.photos.length+chosen.length>30)throw new Error('Максимум 30 фотографий.')
   for(const file of chosen){if(!GALLERY_IMAGE_TYPES.includes(file.type))throw new Error('Выберите PNG, JPEG или WebP.');await media.readFile(file)}
   const bytes=Object.entries(files).reduce((sum,[id,file])=>sum+(id===photo?.id?0:file.size),0)+chosen.reduce((sum,file)=>sum+file.size,0)
   if(bytes>GALLERY_UPLOAD_MAX_BYTES)throw new Error('За одно сохранение можно загрузить до 25 МБ. Сохраните текущие фото и добавьте остальные.')
   for(const file of chosen){const id=photo?.id||`photo-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;clearFile(id);files[id]=file;previews[id]=URL.createObjectURL(file);if(photo)photo.filename=file.name;else form.photos.push({id,caption:'',imagePath:'',filename:file.name})}
  }catch(e){error.value=(e as Error).message}
 }
 function removePhoto(index:number){if(saving.value)return;const photo=form.photos[index];if(photo)clearFile(photo.id);form.photos.splice(index,1)}
 function movePhoto(index:number,delta:number){const target=index+delta;if(saving.value||target<0||target>=form.photos.length)return;form.photos.splice(target,0,form.photos.splice(index,1)[0]!)}
 function photoUrl(photo:ObjectPhoto){return previews[photo.id]||(photo.imagePath?mediaUrl(photo.imagePath):'')}
 function discard(){if(snapshot.value)accept(JSON.parse(snapshot.value));error.value='';notice.value=''}
 const confirmLeave=()=>!saving.value&&(!isDirty.value||window.confirm('Есть несохранённые фотографии объекта. Покинуть страницу?'))
 function warn(event:BeforeUnloadEvent){if(isDirty.value){event.preventDefault();event.returnValue=''}}
 watch(()=>route.query.object,()=>void load())
 onMounted(()=>{void load();window.addEventListener('beforeunload',warn)})
 onBeforeUnmount(()=>{requestId++;clearFiles();window.removeEventListener('beforeunload',warn)})
 onBeforeRouteLeave(confirmLeave)
 onBeforeRouteUpdate((to,from)=>to.query.section===from.query.section&&to.query.object===from.query.object||confirmLeave())
 return{form,options,selectedId,previewHref,loading,saving,loaded,error,notice,isDirty,load,save,discard,selectObject,chooseFiles,removePhoto,movePhoto,photoUrl}
}
