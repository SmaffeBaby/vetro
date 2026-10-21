import type { ContactId, ContactItem, ContactsSettings } from '../types/contacts'
import { contactIcons } from './contact-icons'
import { contactSocialIcons } from './contact-social-icons'
import { defaultContactForm } from './default-contact-form'
export const defaultContactsPage = {
  form: defaultContactForm,
  title: 'Контакты', hours: '', requisitesTitle: 'Реквизиты компании', requisites: '',
  mapSrc: 'https://yandex.ru/map-widget/v1/?ll=30.371767%2C59.951292&mode=whatshere&whatshere%5Bpoint%5D=30.373953%2C59.949925&whatshere%5Bzoom%5D=17&z=14.97',
  mapHref: 'https://yandex.ru/maps/2/saint-petersburg/house/shpalernaya_ulitsa_54_2/Z0kYdQBjQEAEQFtjfXV1eHVhYQ==/?ll=30.371767%2C59.951292&z=14.97',
  mapTitle: 'Яндекс Карты: Санкт-Петербург, Шпалерная улица, 54/2',
  socials: (['telegram', 'whatsapp'] as const).map(id => ({ id, title: id === 'telegram' ? 'Telegram' : 'WhatsApp', href: '', svg: contactSocialIcons[id], iconFilename: `${id}.svg`, iconPath: null }))
}
function item(id: ContactId, title: string, text: string, href: string): ContactItem {
  return { id, title, text, href, mode: 'link', code: '', highlight: '', svg: contactIcons[id], iconFilename: `${id}.svg`, iconPath: null }
}
export const defaultContacts: ContactsSettings = {
  page: defaultContactsPage,
  items: [
    item('phone', 'Телефон', '+7 (911) 720 05 10', 'tel:+79117200510'),
    item('address', 'Адрес', 'г. Санкт-Петербург, ул. Шпалерная, д. 54/2', 'https://yandex.ru/maps/2/saint-petersburg/house/shpalernaya_ulitsa_54_2/Z0kYdQBjQEAEQFtjfXV1eHVhYQ==/'),
    item('email', 'Email', 'help@vetroservice.ru', 'mailto:help@vetroservice.ru')
  ],
  revision: 1,
  updatedAt: null
}
