export interface ObjectResultCard { id:string; value:string; text:string }
export interface ObjectResultsSettings { objectId:string; title:string; cards:ObjectResultCard[]; revision:number; updatedAt:string|null }
