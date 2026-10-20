import type { ObjectsSettings, SiteObject } from '../types/objects'
export const defaultObjectsSettings: ObjectsSettings = {
  "title": "Объекты на обслуживании",
  "buttonLabel": "Подробнее",
  "categories": [
    {
      "id": "medicine",
      "label": "Медицина"
    },
    {
      "id": "education",
      "label": "Образование"
    },
    {
      "id": "business",
      "label": "Бизнес-центры"
    },
    {
      "id": "residential",
      "label": "Жилые комплексы"
    },
    {
      "id": "sport",
      "label": "Спорт"
    }
  ],
  "revision": 1,
  "updatedAt": null
}
export function createEmptyObject(): SiteObject { return { id:'',title:'',address:'',categoryId:'medicine',sortOrder:10,published:false,subtitle:'',description:'',area:'',sinceYear:null,imagePath:null,imageFilename:'',serviceIds:[],revision:0,updatedAt:null } }
