import type {OtherObjectsSettings} from '../../shared/types/other-objects'
export function serializeOtherObjects(row:Record<string,unknown>):OtherObjectsSettings{return{title:row.title as string,buttonLabel:row.button_label as string,objectIds:row.object_ids as string[],revision:Number(row.revision),updatedAt:row.updated_at as string}}
