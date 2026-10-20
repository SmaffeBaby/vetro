import type {ObjectResultsSettings} from '#shared/types/object-results'
import type {ObjectsCatalog} from '#shared/types/objects'
import {createDefaultObjectResults} from '#shared/config/default-object-results'
import {objectResultsInputSchema} from '#shared/utils/object-results'
import {objectHref} from '#shared/utils/objects'
export function useAdminObjectResults(){
 const route=useRoute(),{adminFetch}=useAdminAuth()
 const objects=ref<ObjectsCatalog['objects']>([]),form=reactive<ObjectResultsSettings>(createDefaultObjectResults(''))
 const loading=ref(true),saving=ref(false),loaded=ref(false),error=ref(''),notice=ref(''),snapshot=ref('')
 const isDirty=computed(()=>loaded.value&&JSON.stringify(form)!==snapshot.value)
 const options=computed(()=>objects.value.map(o=>({label:o.title+(o.published?'':' (скрыт)'),value:o.id})))
 const selectedId=computed(()=>typeof route.query.object==='string'?route.query.object:objects.value[0]?.id||'')
 const previewHref=computed(()=>selectedId.value?objectHref(selectedId.value):'/objects')
 let requestId=0
 function accept(value:ObjectResultsSettings){Object.assign(form,structuredClone(value));snapshot.value=JSON.stringify(form);loaded.value=true}
 async function load(){
  if(saving.value)return
  const current=++requestId;loading.value=true;loaded.value=false;error.value='';notice.value=''
  try{
   const catalog=await adminFetch<ObjectsCatalog>('/api/admin/objects')
   if(current!==requestId)return
   objects.value=catalog.objects
   const id=selectedId.value
   if(!id)return
   if(!objects.value.some(o=>o.id===id)){error.value='Объект не найден';return}
   const value=await adminFetch<ObjectResultsSettings>(`/api/admin/object-results/${encodeURIComponent(id)}`)
   if(current===requestId)accept(value)
  }catch{if(current===requestId)error.value='Не удалось загрузить результаты. Проверьте подключение и миграцию базы.'}
  finally{if(current===requestId)loading.value=false}
 }
 async function save(){
  if(!loaded.value||saving.value||form.objectId!==selectedId.value)return
  error.value='';notice.value=''
  const parsed=objectResultsInputSchema.safeParse(form)
  if(!parsed.success){error.value=parsed.error.issues[0]?.message||'Проверьте показатели';return}
  saving.value=true
  try{accept(await adminFetch<ObjectResultsSettings>(`/api/admin/object-results/${encodeURIComponent(form.objectId)}`,{method:'PUT',body:parsed.data}));await refreshNuxtData(`site-object-results-${form.objectId}`);notice.value='Результаты выбранного объекта сохранены.'}
  catch(e){error.value=(e as {data?:{data?:{message?:string}}}).data?.data?.message||'Не удалось сохранить результаты. Повторите попытку.'}
  finally{saving.value=false}
 }
 async function selectObject(id:string){if(!saving.value&&id!==selectedId.value)await navigateTo({path:'/admin',query:{section:'objects-results',object:id}})}
 function addCard(){if(!saving.value&&form.cards.length<16)form.cards.push({id:`result-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,value:'',text:''})}
 function removeCard(index:number){if(!saving.value)form.cards.splice(index,1)}
 function moveCard(index:number,delta:number){const target=index+delta;if(saving.value||target<0||target>=form.cards.length)return;form.cards.splice(target,0,form.cards.splice(index,1)[0]!)}
 function discard(){if(snapshot.value)accept(JSON.parse(snapshot.value));error.value='';notice.value=''}
 const confirmLeave=()=>!saving.value&&(!isDirty.value||window.confirm('Есть несохранённые результаты объекта. Покинуть страницу?'))
 function warn(event:BeforeUnloadEvent){if(isDirty.value){event.preventDefault();event.returnValue=''}}
 watch(()=>route.query.object,()=>void load())
 onMounted(()=>{void load();window.addEventListener('beforeunload',warn)})
 onBeforeUnmount(()=>{requestId++;window.removeEventListener('beforeunload',warn)})
 onBeforeRouteLeave(confirmLeave)
 onBeforeRouteUpdate((to,from)=>to.query.section===from.query.section&&to.query.object===from.query.object||confirmLeave())
 return{form,options,selectedId,previewHref,loading,saving,loaded,error,notice,isDirty,load,save,discard,selectObject,addCard,removeCard,moveCard}
}
