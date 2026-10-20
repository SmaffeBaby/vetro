export default defineEventHandler(async(event)=>{
 const client=serverSupabase(event)
 const [settings,objects]=await Promise.all([client.from('site_objects_settings').select('*').eq('id','main').single(),client.from('site_objects').select('*').eq('published',true).order('sort_order').order('id')])
 if(settings.error||objects.error||!settings.data)throw createError({statusCode:503,statusMessage:'Objects unavailable'})
 setHeader(event,'Cache-Control','no-cache')
 return {settings:serializeObjectsSettings(settings.data),objects:objects.data.map(serializeObject)}
})
