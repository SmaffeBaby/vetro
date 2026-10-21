import type { ContactFormSettings } from '../types/contacts'

export const defaultContactForm: ContactFormSettings = {
  enabled: true,
  title: 'Напишите нам',
  text: 'Если у вас возникли вопросы, заполните форму ниже и мы ответим вам в ближайшее время',
  phoneTitle: 'Предпочитаете позвонить?', phoneText: '+7 (911) 720 05 10', phoneHref: 'tel:+79117200510',
  fields: {
    name: { label: 'Имя', placeholder: 'Ваше имя', required: true },
    phone: { label: 'Телефон', placeholder: '+7 (___) ___-__-__', required: true },
    email: { label: 'E-mail', placeholder: 'Ваш e-mail', required: false },
    subject: { label: 'Тема обращения', placeholder: 'Выберите тему...', required: false },
    message: { label: 'Сообщение', placeholder: 'Текст сообщения...', required: false }
  },
  topics: ['Консультация', 'Обслуживание', 'Сотрудничество', 'Другое'],
  consentText: 'Согласен на обработку персональных данных', consentRequired: true, buttonLabel: 'Отправить'
}
