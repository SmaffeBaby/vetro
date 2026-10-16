import type { ServicesHelpCardSettings } from '../types/services-help-card'
import { defaultHeader } from './default-header'
export const defaultServicesHelpCard: ServicesHelpCardSettings = {
  title: 'Не нашли нужную услугу?',
  text: 'Оставьте заявку в любой удобной форме — наши инженеры проанализируют ваш запрос и подготовят индивидуальное решение.',
  buttonLabel: 'Получить консультацию',
  svg: defaultHeader.logoSvg,
  imagePath: null,
  filename: 'logo.svg',
  revision: 1,
  updatedAt: null
}
