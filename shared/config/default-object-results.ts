import type {ObjectResultsSettings} from '../types/object-results'
export function createDefaultObjectResults(objectId:string):ObjectResultsSettings{return{objectId,title:'Результаты',cards:[],revision:0,updatedAt:null}}
