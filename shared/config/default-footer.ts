import type { FooterEntry, FooterSettings } from '../types/footer'
import { defaultHeader } from './default-header'

function entry(id: string, text: string, href = '', highlight = ''): FooterEntry {
  return { id, text, href, highlight, code: '', mode: href ? 'link' : 'text' }
}
export const defaultFooter: FooterSettings = {
  logoSvg: defaultHeader.logoSvg,
  logoPath: null,
  logoFilename: 'logo.svg',
  text: 'Обслуживание инженерных\nсистем под ключ',
  columns: [
    { id: 'contacts', title: 'Контакты', sortOrder: 10, items: [
      entry('phone', '+7-911-720-05-10', 'tel:+79117200510'),
      entry('email', 'help@vetroservice.ru', 'mailto:help@vetroservice.ru', 'help@vetroservice.ru'),
      entry('address', 'г. Санкт-Петербург,\nул. Шпалерная, д. 54/2')
    ] },
    { id: 'navigation', title: 'О Ветро', sortOrder: 20, items: [
      entry('services', 'Наши услуги', '/services'), entry('projects', 'Объекты', '/objects'),
      entry('about', 'О компании', '/#about'), entry('licenses', 'Лицензии и сертификаты', '/#licenses'), entry('contact', 'Контакты', '/contacts')
    ] }
  ],
  buttonLabel: 'Написать нам',
  leftBottom: [entry('copyright', '© {{year}} Ветро'), entry('privacy', 'Политика конфиденциальности', '/privacy')],
  rightBottom: [entry('light', 'Разработано в Light', 'https://lightdigital.ru/', 'Light')],
  revision: 1,
  updatedAt: null
}
