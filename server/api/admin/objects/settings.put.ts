import { objectsSettingsInputSchema } from '../../../../shared/utils/objects'
export default defineEventHandler(async(event)=>{
 const {client}=await requireSiteAdmin(event)
 const parsed=objectsSettingsInputSchema.safeParse(await readBody(event))
 if(!parsed.success)throw createError({statusCode:400,data:{message:parsed.error.issues[0]?.message}})
 const {data,error}=await client.from('site_objects_settings').update({title:parsed.data.title,button_label:parsed.data.buttonLabel,categories:parsed.data.categories,revision:parsed.data.revision+1,updated_at:new Date().toISOString()}).eq('id','main').eq('revision',parsed.data.revision).select('*').maybeSingle()
 if(error)throw createError({statusCode:error.code==='23514'?400:500,data:{message:error.code==='23514'?'Нельзя удалить категорию, назначенную объекту. Сначала измените категорию объектов.':'Не удалось сохранить каталог.'}})
 if(!data)throw createError({statusCode:409,data:{message:'Настройки изменены. Загрузите актуальную версию.'}})
 return serializeObjectsSettings(data)
})
