import type { ContactId, ContactItem, ContactsSettings } from '../types/contacts'
import { contactIcons } from './contact-icons'
function item(id: ContactId, title: string, text: string, href: string): ContactItem {
  return { id, title, text, href, mode: 'link', code: '', highlight: '', svg: contactIcons[id], iconFilename: `${id}.svg`, iconPath: null }
}
export const defaultContacts: ContactsSettings = {
  items: [
    item('phone', 'Телефон', '+7 (911) 720 05 10', 'tel:+79117200510'),
    item('address', 'Адрес', 'г. Санкт-Петербург, ул. Шпалерная, д. 54/2', 'https://yandex.ru/maps/2/saint-petersburg/house/shpalernaya_ulitsa_54_2/Z0kYdQBjQEAEQFtjfXV1eHVhYQ==/'),
    item('email', 'Email', 'help@vetroservice.ru', 'mailto:help@vetroservice.ru')
  ],
  revision: 1,
  updatedAt: null
}
