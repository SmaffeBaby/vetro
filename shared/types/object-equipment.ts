export interface EquipmentColumn {id:string;title:string}
export interface EquipmentRow {id:string;cells:string[]}
export interface ObjectEquipmentSettings {objectId:string;enabled:boolean;title:string;columns:EquipmentColumn[];rows:EquipmentRow[];description:string;revision:number;updatedAt:string|null}
