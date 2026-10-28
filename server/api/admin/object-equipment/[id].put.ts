import {objectEquipmentInputSchema} from '../../../../shared/utils/object-equipment'
export default defineContentMutationHandler(async(event)=>{
 const {client}=await requireSiteAdmin(event),id=await requireObjectRecord(client,getRouterParam(event,'id'))
 const parsed=objectEquipmentInputSchema.safeParse(await readBody(event))
 if(!parsed.success)throw createError({statusCode:400,data:{message:parsed.error.issues[0]?.message}})
 const {revision,...input}=parsed.data,patch={...input,revision:revision+1,updated_at:new Date().toISOString()}
 const {data,error}=revision===0?await client.from('site_object_equipment').insert({...patch,object_id:id}).select('*').maybeSingle():await client.from('site_object_equipment').update(patch).eq('object_id',id).eq('revision',revision).select('*').maybeSingle()
 if(error?.code==='23505'||!data&&!error)throw createError({statusCode:409,data:{message:'Оборудование уже изменено. Загрузите актуальную версию.'}})
 if(error||!data)throw createError({statusCode:500,data:{message:'Не удалось сохранить оборудование объекта.'}})
 return serializeObjectEquipment(data)
})
