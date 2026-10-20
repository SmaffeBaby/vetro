export interface ObjectPhoto {id:string;caption:string;imagePath:string;filename:string}
export interface ObjectGallerySettings {objectId:string;title:string;photos:ObjectPhoto[];revision:number;updatedAt:string|null;mediaCleanupPending?:boolean}
