import type { FaqSettings } from '../types/faq'
import { faqIcons } from './faq-icons'
export const defaultFaq: FaqSettings = {
  questions: [
    { id: 'systems', question: 'Какие типы систем вы обслуживаете?', answer: 'Обслуживаем инженерные системы зданий, индивидуальные тепловые пункты и узлы учёта тепловой энергии. Состав работ уточняем после знакомства с объектом.' },
    { id: 'emergency', question: 'Как быстро вы можете реагировать на аварии?', answer: 'Порядок и время аварийного реагирования согласовываем индивидуально и закрепляем в договоре обслуживания.' },
    { id: 'warranty', question: 'Предоставляете ли вы гарантию на свою работу?', answer: 'Гарантийные условия зависят от вида работ и фиксируются в договоре. Обсудим их при подготовке предложения.' },
    { id: 'region', question: 'Можете ли вы обслуживать объекты за пределами города?', answer: 'Возможность обслуживания зависит от расположения объекта и состава работ. Свяжитесь с нами, чтобы обсудить ваш объект.' },
    { id: 'certificates', question: 'Какие сертификаты имеют ваши специалисты?', answer: 'Документы и допуски для конкретных работ предоставим по запросу. Информация также доступна в разделе «Лицензии и сертификаты».' }
  ],
  benefits: [
    { id: 'quality', svg: faqIcons.quality, iconFilename: 'quality.svg', iconPath: null, title: 'Гарантия качества', text: 'Применяются высочайшие отраслевые стандарты' },
    { id: 'speed', svg: faqIcons.speed, iconFilename: 'speed.svg', iconPath: null, title: 'Работа в краткие сроки', text: 'Соблюдение графиков и сроков' },
    { id: 'experience', svg: faqIcons.experience, iconFilename: 'experience.svg', iconPath: null, title: 'Проверенный опыт', text: 'Успешный опыт более 100 проектов' }
  ],
  revision: 1, updatedAt: null
}
