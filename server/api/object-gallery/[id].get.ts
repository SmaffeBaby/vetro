export default definePublicContentHandler(async(event)=>{const client=serverSupabase(event),id=await requireObjectRecord(client,getRouterParam(event,'id'),true);return readObjectGallery(client,id)})
