import {otherObjectsInputSchema} from '../../../shared/utils/other-objects'
export default defineContentMutationHandler(async(event)=>{
 const {client}=await requireSiteAdmin(event)
 const parsed=otherObjectsInputSchema.safeParse(await readBody(event))
 if(!parsed.success)throw createError({statusCode:400,data:{message:parsed.error.issues[0]?.message}})
 if(parsed.data.objectIds.length){const {data,error}=await client.from('site_objects').select('id').in('id',parsed.data.objectIds);if(error)throw createError({statusCode:503,statusMessage:'Objects unavailable'});if(data.length!==parsed.data.objectIds.length)throw createError({statusCode:400,data:{message:'Один из объектов больше не существует. Обновите список.'}})}
 const {data,error}=await client.from('site_other_objects').update({title:parsed.data.title,button_label:parsed.data.buttonLabel,object_ids:parsed.data.objectIds,revision:parsed.data.revision+1,updated_at:new Date().toISOString()}).eq('id','main').eq('revision',parsed.data.revision).select('*').maybeSingle()
 if(error)throw createError({statusCode:500,data:{message:'Не удалось сохранить блок «Другие объекты».'}})
 if(!data)throw createError({statusCode:409,data:{message:'Настройки уже изменены. Загрузите актуальную версию.'}})
 return serializeOtherObjects(data)
})
