import { defaultServicesHelpCard } from './default-services-help-card'
import type { ServicesHelpCardSettings } from '../types/services-help-card'
export const defaultObjectsRequestCard: ServicesHelpCardSettings = {
 ...defaultServicesHelpCard,
 title:'Хотите такой же уровень обслуживания на вашем объекте?',
 text:'Свяжитесь с нами для проведения аудита систем и составления индивидуального плана обслуживания.',
 buttonLabel:'Оставить заявку'
}
