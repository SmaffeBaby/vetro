import { objectIdSchema } from '../../../shared/utils/objects'
export default definePublicContentHandler(async(event)=>{
 const id=objectIdSchema.safeParse(getRouterParam(event,'id'))
 if(!id.success)throw createError({statusCode:404,statusMessage:'Объект не найден'})
 const {data,error}=await serverSupabase(event).from('site_objects').select('*').eq('id',id.data).eq('published',true).maybeSingle()
 if(error)throw createError({statusCode:503,statusMessage:'Object unavailable'})
 if(!data)throw createError({statusCode:404,statusMessage:'Объект не найден'})
 return serializeObject(data)
})
