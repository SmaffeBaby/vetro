import { objectInputSchema,objectIdSchema } from '../../../../shared/utils/objects'
export default defineContentMutationHandler(async(event)=>{
 const {client}=await requireSiteAdmin(event)
 const parts=await readMultipartFormData(event)
 let input:unknown
 try{input=JSON.parse(parts?.find(p=>p.name==='settings')?.data.toString('utf8')||'')}catch{throw createError({statusCode:400,data:{message:'Некорректные настройки объекта.'}})}
 const parsed=objectInputSchema.safeParse(input),routeId=objectIdSchema.safeParse(getRouterParam(event,'id'))
 if(!parsed.success||!routeId.success||parsed.data.id!==routeId.data)throw createError({statusCode:400,data:{message:!parsed.success?parsed.error.issues[0]?.message:'Некорректный ID объекта.'}})
 const value=parsed.data
 const files=parts?.filter(p=>p.name==='image')||[],file=files[0]
 if(files.length>1||file&&(!file.filename||file.type!=='image/png'||value.removeImage||!file.data.length||file.data.length>5_000_000||!file.data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))))throw createError({statusCode:400,data:{message:'Выберите изображение PNG до 5 МБ.'}})
 const [old,settings,services]=await Promise.all([client.from('site_objects').select('*').eq('id',value.id).maybeSingle(),client.from('site_objects_settings').select('categories').eq('id','main').single(),client.from('site_services').select('cards').eq('id','main').single()])
 if(old.error||settings.error||services.error)throw createError({statusCode:503,statusMessage:'Object settings unavailable'})
 const previous=old.data
 const conflict=()=>createError({statusCode:409,data:{message:'Объект уже изменён или ID занят. Загрузите актуальную версию.'}})
 if(Number(previous?.revision??0)!==value.revision)throw conflict()
 if(!(settings.data.categories as {id:string}[]).some(c=>c.id===value.categoryId)||value.serviceIds.some(id=>!(services.data.cards as {id:string}[]).some(c=>c.id===id)))throw createError({statusCode:400,data:{message:'Категория или услуга больше не существует. Обновите страницу.'}})
 let path=value.removeImage?null:previous?.image_path??null,filename=value.removeImage?'':previous?.image_filename??'',uploaded:string|null=null
 if(file){const media=await uploadMedia(client,'Objects/Photos',`${value.id}-${file.filename}`,'image/png',file.data);path=uploaded=media.path;filename=media.filename}
 const cleanup=[...new Set<string>([...(previous?.media_cleanup_paths||[]),...(previous?.image_path&&previous.image_path!==path?[previous.image_path]:[])])]
 const patch={title:value.title,address:value.address,category_id:value.categoryId,sort_order:value.sortOrder,published:value.published,subtitle:value.subtitle,description:value.description,area:value.area,since_year:value.sinceYear,service_ids:value.serviceIds,image_path:path,image_filename:filename,media_cleanup_paths:cleanup,revision:value.revision+1,updated_at:new Date().toISOString()}
 const {data,error}=previous?await client.from('site_objects').update(patch).eq('id',value.id).eq('revision',value.revision).select('*').maybeSingle():await client.from('site_objects').insert({...patch,id:value.id}).select('*').maybeSingle()
 if(error||!data){if(uploaded){try{await removeMedia(client,[uploaded])}catch(e){console.error('Unpublished object photo cleanup failed',e)}}if(error?.code==='23505'||!data&&!error)throw conflict();throw createError({statusCode:error?.code==='23514'?400:500,data:{message:'Не удалось сохранить объект. Проверьте категорию и выбранные услуги.'}})}
 if(cleanup.length){try{await removeMedia(client,cleanup);const cleared=await client.from('site_objects').update({media_cleanup_paths:[]}).eq('id',value.id).eq('revision',data.revision);if(!cleared.error)data.media_cleanup_paths=[]}catch{/*Retry on next save.*/}}
 return serializeObject(data)
})
