import type { ServiceRequestSettings } from '../types/services-request'
import { defaultHeader } from './default-header'
export function createDefaultServiceRequest(serviceId: string): ServiceRequestSettings {
  return {
    serviceId,
    title: 'Оставьте заявку — мы свяжемся с вами в течение часа',
    description: 'Наши ведущие инженеры готовы проанализировать особенности вашего объекта, дать рекомендации по безопасности и составить предварительный расчёт стоимости.',
    note: 'Для экстренных случаев доступна круглосуточная горячая линия:\n+7 (812) 000-00-00.',
    buttonLabel: 'Оставить заявку',
    svg: defaultHeader.logoSvg,
    imagePath: null,
    filename: 'logo.svg',
    revision: 0,
    updatedAt: null
  }
}
