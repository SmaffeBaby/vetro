import type { ServiceCard } from '../types/services'
import type { ServiceDetailSettings } from '../types/services-detail'
// The house mark from the shared brand logo, rendered as a pale decorative background.
export const serviceDetailBackgroundSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" fill="none"><path d="M8 65V34L53 14L94 32M8 55H72C85 55 94 65 94 79C94 92 84 102 72 102H33C19 102 8 91 8 77V72" stroke="#2a9ccf" stroke-width="14" stroke-linejoin="round"/></svg>'
export function createDefaultServiceDetail(card: ServiceCard): ServiceDetailSettings {
  return {
    serviceId: card.id,
    title: card.title,
    text: card.id === 'security' ? 'Пожарная и охранная сигнализация, СОУЭ, видеонаблюдение, тревожная сигнализация, СКУД, системы противодымной защиты, внутренний противопожарный водопровод и система контроля загазованности.' : card.text,
    buttonLabel: 'Оставить заявку',
    svg: serviceDetailBackgroundSvg,
    imagePath: null,
    filename: `${card.id}-background.svg`,
    revision: 0,
    updatedAt: null
  }
}
export function serviceBreadcrumb(title: string): string { return title.match(/\(([^()]+)\)\s*$/)?.[1] || title }
