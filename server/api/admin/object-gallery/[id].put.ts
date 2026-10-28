import {objectGalleryInputSchema,GALLERY_IMAGE_TYPES,GALLERY_UPLOAD_MAX_BYTES} from '../../../../shared/utils/object-gallery'
import type {ObjectPhoto} from '../../../../shared/types/object-gallery'
export default defineContentMutationHandler(async(event)=>{
 const {client}=await requireSiteAdmin(event),id=await requireObjectRecord(client,getRouterParam(event,'id'))
 const parts=await readMultipartFormData(event)
 let input:unknown
 try{input=JSON.parse(parts?.find(p=>p.name==='settings')?.data.toString('utf8')||'')}catch{throw createError({statusCode:400,data:{message:'Некорректные настройки галереи.'}})}
 const parsed=objectGalleryInputSchema.safeParse(input)
 if(!parsed.success)throw createError({statusCode:400,data:{message:parsed.error.issues[0]?.message}})
 const files=(parts||[]).filter(p=>p.name?.startsWith('image:')),ids=new Set(parsed.data.photos.map(p=>p.id))
 const validImage=(type:string,bytes:Buffer)=>type==='image/png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:type==='image/webp'&&bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP'
 if(new Set(files.map(f=>f.name)).size!==files.length||files.reduce((sum,f)=>sum+f.data.length,0)>GALLERY_UPLOAD_MAX_BYTES||files.some(f=>!ids.has(f.name!.slice(6))||!f.filename||!f.type||!GALLERY_IMAGE_TYPES.includes(f.type)||!f.data.length||f.data.length>5_000_000||!validImage(f.type,f.data)))throw createError({statusCode:400,data:{message:'Выберите PNG, JPEG или WebP до 5 МБ. Общий размер новых файлов — до 25 МБ за сохранение.'}})
 const {data:previous,error:readError}=await client.from('site_object_gallery').select('*').eq('object_id',id).maybeSingle()
 if(readError)throw createError({statusCode:503,statusMessage:'Object gallery unavailable'})
 const conflict=()=>createError({statusCode:409,data:{message:'Галерея уже изменена. Загрузите актуальную версию.'}})
 if(Number(previous?.revision??0)!==parsed.data.revision)throw conflict()
 const oldPhotos=(previous?.photos||[]) as ObjectPhoto[],uploaded:string[]=[],photos:ObjectPhoto[]=[]
 async function rollback(){try{await removeMedia(client,uploaded)}catch(error){console.error('Unpublished gallery photo cleanup failed',error)}}
 try{
  for(const photo of parsed.data.photos){
   const old=oldPhotos.find(p=>p.id===photo.id),file=files.find(f=>f.name===`image:${photo.id}`)
   if(file){const media=await uploadMedia(client,'Objects/Gallery',`${id}-${file.filename}`,file.type!,file.data);uploaded.push(media.path);photos.push({...photo,imagePath:media.path,filename:media.filename})}
   else if(old?.imagePath)photos.push({...photo,imagePath:old.imagePath,filename:old.filename})
   else throw createError({statusCode:400,data:{message:'Загрузите фото для каждой новой карточки.'}})
  }
 }catch(error){await rollback();throw error}
 const kept=new Set(photos.map(p=>p.imagePath)),cleanup=[...new Set<string>([...(previous?.media_cleanup_paths||[]),...oldPhotos.flatMap(p=>!kept.has(p.imagePath)?[p.imagePath]:[])])].filter(path=>!kept.has(path))
 const patch={title:parsed.data.title,photos,media_cleanup_paths:cleanup,revision:parsed.data.revision+1,updated_at:new Date().toISOString()}
 const {data,error}=previous?await client.from('site_object_gallery').update(patch).eq('object_id',id).eq('revision',parsed.data.revision).select('*').maybeSingle():await client.from('site_object_gallery').insert({...patch,object_id:id}).select('*').maybeSingle()
 if(error||!data){await rollback();if(error?.code==='23505'||!data&&!error)throw conflict();throw createError({statusCode:500,data:{message:'Не удалось сохранить галерею.'}})}
 if(cleanup.length){try{await removeMedia(client,cleanup);const cleared=await client.from('site_object_gallery').update({media_cleanup_paths:[]}).eq('object_id',id).eq('revision',data.revision);if(!cleared.error)data.media_cleanup_paths=[]}catch{/*Retry on next save.*/}}
 return serializeObjectGallery(data)
})
