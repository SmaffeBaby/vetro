import type { ServicePriceSettings } from '../types/services-prices'
export function createDefaultServicePrices(serviceId: string): ServicePriceSettings {
  return {
    serviceId,
    title: 'Стоимость услуг',
    description: 'Базовые тарифы на основные работы. Точная стоимость рассчитывается индивидуально после обследования объекта.',
    buttonLabel: 'Запросить точный расчёт',
    rows: serviceId === 'security' ? [
      { id: 'design', name: 'Проектирование системы безопасности', price: 'от 25 000 ₽' },
      { id: 'video', name: 'Монтаж видеонаблюдения (за камеру)', price: 'от 3 500 ₽' },
      { id: 'access', name: 'Установка СКУД (за точку доступа)', price: 'от 15 000 ₽' },
      { id: 'alarm', name: 'Монтаж охранной сигнализации', price: 'от 45 000 ₽' },
      { id: 'commissioning', name: 'Пусконаладочные работы', price: 'от 20 000 ₽' }
    ] : [],
    revision: 0,
    updatedAt: null
  }
}
