export default defineEventHandler(async(event)=>{const {client}=await requireSiteAdmin(event),id=await requireObjectRecord(client,getRouterParam(event,'id'));return readObjectEquipment(client,id)})
