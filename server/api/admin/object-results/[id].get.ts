export default defineEventHandler(async(event)=>{
 const {client}=await requireSiteAdmin(event)
 const id=await requireResultsObject(client,getRouterParam(event,'id'))
 return readObjectResults(client,id)
})
