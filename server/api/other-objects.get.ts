export default definePublicContentHandler(async(event)=>{
 const {data,error}=await serverSupabase(event).from('site_other_objects').select('*').eq('id','main').single()
 if(error||!data)throw createError({statusCode:503,statusMessage:'Other objects settings unavailable'})
 return serializeOtherObjects(data)
})
