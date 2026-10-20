import type {ObjectResultsSettings} from '../../shared/types/object-results'
import {createDefaultObjectResults} from '../../shared/config/default-object-results'
import type {SupabaseClient} from '@supabase/supabase-js'
export function serializeObjectResults(row:Record<string,unknown>):ObjectResultsSettings{return{objectId:row.object_id as string,title:row.title as string,cards:row.cards as ObjectResultsSettings['cards'],revision:Number(row.revision),updatedAt:row.updated_at as string}}
export async function readObjectResults(client:SupabaseClient,id:string):Promise<ObjectResultsSettings>{
 const {data,error}=await client.from('site_object_results').select('*').eq('object_id',id).maybeSingle()
 if(error)throw createError({statusCode:503,statusMessage:'Object results unavailable'})
 return data?serializeObjectResults(data):createDefaultObjectResults(id)
}
