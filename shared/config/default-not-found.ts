import type { NotFoundSettings } from '../types/not-found'

export const defaultNotFound: NotFoundSettings = {
  title: 'Такая страница не найдена',
  text: 'Возможно, страница была удалена или вы перешли по неверному адресу',
  primaryLabel: 'На главную', primaryHref: '/',
  secondaryLabel: 'Каталог услуг', secondaryHref: '/services',
  showLogo: true, revision: 1, updatedAt: null
}
