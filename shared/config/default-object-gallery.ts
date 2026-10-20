import type {ObjectGallerySettings} from '../types/object-gallery'
export function createDefaultObjectGallery(objectId:string):ObjectGallerySettings{return{objectId,title:'Фотографии с объекта',photos:[],revision:0,updatedAt:null}}
