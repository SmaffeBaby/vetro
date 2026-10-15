import type { CostsSettings } from '../types/costs'
export const defaultCosts: CostsSettings = {
  fields: [
    { id: 'system', label: 'Тип системы', options: ['ИТП', 'УУТЭ', 'Комплексное обслуживание'] },
    { id: 'object', label: 'Тип объекта', options: ['Коммерческий объект', 'Промышленный объект', 'Жилое здание'] },
    { id: 'area', label: 'Площадь / Число этажей', options: ['До 500 м²', '500–2000 м²', 'Более 2000 м²'] },
    { id: 'contact', label: 'Контактная информация', options: ['По телефону', 'По электронной почте'] }
  ],
  buttonLabel: 'Получить расчёт', revision: 1, updatedAt: null
}
