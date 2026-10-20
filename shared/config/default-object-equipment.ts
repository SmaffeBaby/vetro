import type {ObjectEquipmentSettings} from '../types/object-equipment'
export function createDefaultObjectEquipment(objectId:string):ObjectEquipmentSettings{return{objectId,enabled:false,title:'Обслуживаемое оборудование',columns:[{id:'equipment',title:'Оборудование'},{id:'quantity',title:'Кол-во'}],rows:[],description:'',revision:0,updatedAt:null}}
