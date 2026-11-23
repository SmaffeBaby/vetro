import type { HeroSettings } from '../types/hero'

export const defaultHeroImageFilename = 'engineering-systems.webp'
export const defaultHeroImagePath = `/images/home/hero/${defaultHeroImageFilename}`

export const defaultHero: HeroSettings = {
  title: 'Обслуживание\nинженерных систем',
  accentTitle: 'под ключ',
  text: '',
  regalia: ['15 лет опыта', '200+ объектов', 'Собственная бригада'],
  imagePath: defaultHeroImagePath,
  imageFilename: defaultHeroImageFilename,
  primaryButtonLabel: 'Рассчитать стоимость',
  secondaryButtonLabel: 'Наши услуги',
  revision: 1,
  updatedAt: null
}
