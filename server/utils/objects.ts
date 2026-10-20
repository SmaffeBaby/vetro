import type {SupabaseClient} from '@supabase/supabase-js'
import {objectIdSchema} from '../../shared/utils/objects'
import type { ObjectsSettings, SiteObject } from '../../shared/types/objects'
export function serializeObjectsSettings(row: Record<string, unknown>): ObjectsSettings { return { title:row.title as string,buttonLabel:row.button_label as string,categories:row.categories as ObjectsSettings['categories'],revision:Number(row.revision),updatedAt:row.updated_at as string } }
export function serializeObject(row: Record<string, unknown>): SiteObject { return { id:row.id as string,title:row.title as string,address:row.address as string,categoryId:row.category_id as string,sortOrder:Number(row.sort_order),published:row.published as boolean,subtitle:row.subtitle as string,description:row.description as string,area:row.area as string,sinceYear:row.since_year == null ? null : Number(row.since_year),imagePath:row.image_path as string|null,imageFilename:row.image_filename as string,serviceIds:row.service_ids as string[],revision:Number(row.revision),updatedAt:row.updated_at as string,mediaCleanupPending:Array.isArray(row.media_cleanup_paths)&&row.media_cleanup_paths.length>0 } }

export async function requireObjectRecord(client:SupabaseClient,raw:unknown,publicOnly=false):Promise<string>{
 const id=objectIdSchema.safeParse(raw)
 if(!id.success)throw createError({statusCode:404,statusMessage:'Объект не найден'})
 let query=client.from('site_objects').select('id').eq('id',id.data)
 if(publicOnly)query=query.eq('published',true)
 const {data,error}=await query.maybeSingle()
 if(error)throw createError({statusCode:503,statusMessage:'Object unavailable'})
 if(!data)throw createError({statusCode:404,statusMessage:'Объект не найден'})
 return id.data
}
