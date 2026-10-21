import type { AboutHistorySettings } from '../types/about-history'
export const defaultAboutHistory: AboutHistorySettings = {
  title: 'История компании',
  cards: [
    { id: 'foundation', year: '2012', description: 'Основание компании, первые проекты по системам безопасности' },
    { id: 'licenses', year: '2014', description: 'Получение лицензии МЧС и допуска СРО' },
    { id: 'team', year: '2016', description: 'Расширение штата до 20 специалистов' }
  ], revision: 1, updatedAt: null
}
