export default defineEventHandler(async(event)=>{
 const client=serverSupabase(event),id=await requireResultsObject(client,getRouterParam(event,'id'),true)
 setHeader(event,'Cache-Control','no-cache')
 return readObjectResults(client,id)
})
