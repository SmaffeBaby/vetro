import type {ObjectEquipmentSettings} from '#shared/types/object-equipment'
import type {ObjectsCatalog} from '#shared/types/objects'
import {createDefaultObjectEquipment} from '#shared/config/default-object-equipment'
import {objectEquipmentInputSchema} from '#shared/utils/object-equipment'
import {objectHref} from '#shared/utils/objects'
export function useAdminObjectEquipment(){
 const route=useRoute(),{adminFetch}=useAdminAuth()
 const objects=ref<ObjectsCatalog['objects']>([]),form=reactive<ObjectEquipmentSettings>(createDefaultObjectEquipment(''))
 const loading=ref(true),saving=ref(false),loaded=ref(false),error=ref(''),notice=ref(''),snapshot=ref('')
 const isDirty=computed(()=>loaded.value&&JSON.stringify(form)!==snapshot.value)
 const options=computed(()=>objects.value.map(o=>({label:o.title+(o.published?'':' (скрыт)'),value:o.id})))
 const selectedId=computed(()=>typeof route.query.object==='string'?route.query.object:objects.value[0]?.id||'')
 const previewHref=computed(()=>selectedId.value?objectHref(selectedId.value):'/objects')
 let requestId=0
 function accept(value:ObjectEquipmentSettings){Object.assign(form,structuredClone(value));snapshot.value=JSON.stringify(form);loaded.value=true}
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
   const value=await adminFetch<ObjectEquipmentSettings>(`/api/admin/object-equipment/${encodeURIComponent(id)}`)
   if(current===requestId)accept(value)
  }catch{if(current===requestId)error.value='Не удалось загрузить оборудование. Проверьте подключение и миграцию базы.'}
  finally{if(current===requestId)loading.value=false}
 }
 async function save(){
  if(!loaded.value||saving.value||form.objectId!==selectedId.value)return
  error.value='';notice.value=''
  const parsed=objectEquipmentInputSchema.safeParse(form)
  if(!parsed.success){error.value=parsed.error.issues[0]?.message||'Проверьте таблицу';return}
  saving.value=true
  try{accept(await adminFetch<ObjectEquipmentSettings>(`/api/admin/object-equipment/${encodeURIComponent(form.objectId)}`,{method:'PUT',body:parsed.data}));notice.value='Оборудование выбранного объекта сохранено.'}
  catch(e){error.value=(e as {data?:{data?:{message?:string}}}).data?.data?.message||'Не удалось сохранить оборудование. Повторите попытку.'}
  finally{saving.value=false}
 }
 async function selectObject(id:string){if(!saving.value&&id!==selectedId.value)await navigateTo({path:'/admin',query:{section:'objects-equipment',object:id}})}
 function addRow(){if(!saving.value&&form.rows.length<100)form.rows.push({id:`row-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,cells:form.columns.map(()=>'')})}
 function removeRow(index:number){if(!saving.value)form.rows.splice(index,1)}
 function moveRow(index:number,delta:number){const target=index+delta;if(saving.value||target<0||target>=form.rows.length)return;form.rows.splice(target,0,form.rows.splice(index,1)[0]!)}
 function addColumn(){if(saving.value||form.columns.length>=8)return;form.columns.push({id:`column-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,title:''});form.rows.forEach(row=>row.cells.push(''))}
 function removeColumn(index:number){if(saving.value||form.columns.length<=1)return;if(form.rows.some(row=>row.cells[index]?.trim())&&!window.confirm('Удалить столбец вместе с его ячейками? Изменения применятся после сохранения.'))return;form.columns.splice(index,1);form.rows.forEach(row=>row.cells.splice(index,1))}
 function moveColumn(index:number,delta:number){const target=index+delta;if(saving.value||target<0||target>=form.columns.length)return;form.columns.splice(target,0,form.columns.splice(index,1)[0]!);form.rows.forEach(row=>row.cells.splice(target,0,row.cells.splice(index,1)[0]!))}
 function discard(){if(snapshot.value)accept(JSON.parse(snapshot.value));error.value='';notice.value=''}
 const confirmLeave=()=>!saving.value&&(!isDirty.value||window.confirm('Есть несохранённые изменения оборудования объекта. Покинуть страницу?'))
 function warn(event:BeforeUnloadEvent){if(isDirty.value){event.preventDefault();event.returnValue=''}}
 watch(()=>route.query.object,()=>void load())
 onMounted(()=>{void load();window.addEventListener('beforeunload',warn)})
 onBeforeUnmount(()=>{requestId++;window.removeEventListener('beforeunload',warn)})
 onBeforeRouteLeave(confirmLeave)
 onBeforeRouteUpdate((to,from)=>to.query.section===from.query.section&&to.query.object===from.query.object||confirmLeave())
 return{form,options,selectedId,previewHref,loading,saving,loaded,error,notice,isDirty,load,save,discard,selectObject,addRow,removeRow,moveRow,addColumn,removeColumn,moveColumn}
}
