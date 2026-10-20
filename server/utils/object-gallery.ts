import type {ObjectGallerySettings} from '../../shared/types/object-gallery'
import {createDefaultObjectGallery} from '../../shared/config/default-object-gallery'
import type {SupabaseClient} from '@supabase/supabase-js'
export function serializeObjectGallery(row:Record<string,unknown>):ObjectGallerySettings{return{objectId:row.object_id as string,title:row.title as string,photos:row.photos as ObjectGallerySettings['photos'],revision:Number(row.revision),updatedAt:row.updated_at as string,mediaCleanupPending:Array.isArray(row.media_cleanup_paths)&&row.media_cleanup_paths.length>0}}
export async function readObjectGallery(client:SupabaseClient,id:string):Promise<ObjectGallerySettings>{const {data,error}=await client.from('site_object_gallery').select('*').eq('object_id',id).maybeSingle();if(error)throw createError({statusCode:503,statusMessage:'Object gallery unavailable'});return data?serializeObjectGallery(data):createDefaultObjectGallery(id)}
