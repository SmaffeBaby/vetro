import {objectResultsInputSchema} from '../../../../shared/utils/object-results'
export default defineEventHandler(async(event)=>{
 const {client}=await requireSiteAdmin(event)
 const id=await requireResultsObject(client,getRouterParam(event,'id'))
 const parsed=objectResultsInputSchema.safeParse(await readBody(event))
 if(!parsed.success)throw createError({statusCode:400,data:{message:parsed.error.issues[0]?.message}})
 const patch={title:parsed.data.title,cards:parsed.data.cards,revision:parsed.data.revision+1,updated_at:new Date().toISOString()}
 const {data,error}=parsed.data.revision===0
 ? await client.from('site_object_results').insert({...patch,object_id:id}).select('*').maybeSingle()
 : await client.from('site_object_results').update(patch).eq('object_id',id).eq('revision',parsed.data.revision).select('*').maybeSingle()
 if(error?.code==='23505'||!data&&!error)throw createError({statusCode:409,data:{message:'Результаты уже изменены. Загрузите актуальную версию.'}})
 if(error||!data)throw createError({statusCode:500,data:{message:'Не удалось сохранить результаты объекта.'}})
 return serializeObjectResults(data)
})
