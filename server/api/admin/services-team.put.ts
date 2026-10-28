import { servicesTeamInputSchema, sortTeamCards } from '../../../shared/utils/services-team'
import type { TeamCard } from '../../../shared/types/services-team'

export default defineContentMutationHandler(async (event) => {
 const { client } = await requireSiteAdmin(event)
 const parts = await readMultipartFormData(event)
 let input: unknown
 try { input = JSON.parse(parts?.find(p => p.name === 'settings')?.data.toString('utf8') || '') }
 catch { throw createError({ statusCode: 400, data: { message: 'Некорректные настройки команды.' } }) }
 const parsed = servicesTeamInputSchema.safeParse(input)
 if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
 const files = (parts || []).filter(p => p.name?.startsWith('image:'))
 const ids = new Set(parsed.data.cards.map(c => c.id))
 if (new Set(files.map(f => f.name)).size !== files.length || files.some(f => !ids.has(f.name!.slice(6)) || !f.filename || f.type !== 'image/png' || !f.data.length || f.data.length > 5_000_000 || !f.data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || parsed.data.cards.find(c => c.id === f.name!.slice(6))?.removeImage)) {
   throw createError({ statusCode: 400, data: { message: 'Выберите фото PNG до 5 МБ для существующей карточки.' } })
 }
 const conflict = () => createError({ statusCode: 409, data: { message: 'Команда уже изменена. Загрузите актуальную версию.' } })
 const { data: previous, error: readError } = await client.from('site_services_team').select('*').eq('id','main').single()
 if (readError || !previous) throw createError({ statusCode: 503, data: { message: 'Не удалось загрузить команду. Проверьте миграцию базы.' } })
 if (Number(previous.revision) !== parsed.data.revision) throw conflict()
 const oldCards = previous.cards as TeamCard[]
 const cards: TeamCard[] = [], uploaded: string[] = []
 async function rollback() { try { await removeMedia(client,uploaded) } catch (error) { console.error('Unable to remove unpublished team photos',error) } }
 try {
   for (const card of sortTeamCards(parsed.data.cards)) {
     const old = oldCards.find(c => c.id === card.id), file = files.find(f => f.name === `image:${card.id}`)
     let imagePath = card.removeImage ? null : old?.imagePath ?? null
     let imageFilename = card.removeImage ? '' : old?.imageFilename ?? ''
     if (file) {
       const media = await uploadMedia(client,'Services/DetailServices/Team',file.filename!,'image/png',file.data)
       imagePath = media.path; imageFilename = media.filename; uploaded.push(media.path)
     }
     const { removeImage: _, ...fields } = card
     cards.push({ ...fields,imagePath,imageFilename })
   }
 } catch (error) { await rollback(); throw error }
 const kept = new Set(cards.map(c => c.imagePath))
 const cleanup = [...new Set<string>([...(previous.media_cleanup_paths || []),...oldCards.flatMap(c => c.imagePath && !kept.has(c.imagePath) ? [c.imagePath] : [])])].filter(path => !kept.has(path))
 const { data,error } = await client.from('site_services_team').update({title:parsed.data.title,description:parsed.data.description,cards,media_cleanup_paths:cleanup,revision:parsed.data.revision+1,updated_at:new Date().toISOString()}).eq('id','main').eq('revision',parsed.data.revision).select('*').maybeSingle()
 if (error || !data) { await rollback(); if (error) throw createError({statusCode:500,data:{message:'Не удалось сохранить команду.'}}); throw conflict() }
 if (cleanup.length) {
   try {
     await removeMedia(client,cleanup)
     const cleared = await client.from('site_services_team').update({media_cleanup_paths:[]}).eq('id','main').eq('revision',data.revision)
     if (!cleared.error) data.media_cleanup_paths=[]
   } catch { /* Retry cleanup on the next save; settings are already published. */ }
 }
 return serializeServicesTeam(data)
})
