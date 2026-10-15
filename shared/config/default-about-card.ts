import type { AboutCardSettings } from '../types/about-card'

export const defaultAboutCard: AboutCardSettings = {
  leftItems: [
    { id: 'objects', title: '100+', text: 'объектов под защитой' },
    { id: 'experience', title: '15', text: 'лет на рынке' }
  ],
  centerText: 'Сегодня мы по праву являемся одним из лидеров рынка систем пожарной безопасности в Российской Федерации',
  rightItems: [
    { id: 'solutions', text: 'Мы предоставляем комплексные инженерные решения для коммерческих и промышленных объектов, сочетая технические знания с надёжным обслуживанием.' },
    { id: 'trust', text: 'Наши клиенты доверяют нам обслуживание критической инфраструктуры, зная, что качество и безопасность — наши главные приоритеты.' }
  ],
  revision: 1,
  updatedAt: null
}
