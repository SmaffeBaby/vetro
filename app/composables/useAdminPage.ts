export function useAdminPage() {
  const auth = useAdminAuth()
  onMounted(auth.restore)
  const route = useRoute()
  const section = computed(() => route.query.section === 'about-letters' ? 'about-letters' : route.query.section === 'about-history' ? 'about-history' : route.query.section === 'about-hero' ? 'about-hero' : route.query.section === 'contacts-form' ? 'contacts-form' : route.query.section === 'contacts-page' ? 'contacts-page' : route.query.section === 'not-found' ? 'not-found' : route.query.section === 'objects-equipment' ? 'objects-equipment' : route.query.section === 'objects-gallery' ? 'objects-gallery' : route.query.section === 'objects-results' ? 'objects-results' : route.query.section === 'objects-other' ? 'objects-other' : route.query.section === 'objects-request-card' ? 'objects-request-card' : route.query.section === 'objects-next-object' ? 'objects-next-object' : route.query.section === 'objects-detail' ? 'objects-detail' : route.query.section === 'objects' ? 'objects' : route.query.section === 'services-included' ? 'services-included' : route.query.section === 'services-team' ? 'services-team' : route.query.section === 'services-why-us' ? 'services-why-us' : route.query.section === 'services-prices' ? 'services-prices' : route.query.section === 'services-request' ? 'services-request' : route.query.section === 'services-detail' ? 'services-detail' : route.query.section === 'services-help-card' ? 'services-help-card' : route.query.section === 'services' ? 'services' : route.query.section === 'why' ? 'why' : route.query.section === 'how-work' ? 'how-work' : route.query.section === 'license' ? 'license' : route.query.section === 'costs' ? 'costs' : route.query.section === 'faq' ? 'faq' : route.query.section === 'contacts' ? 'contacts' : route.query.section === 'footer' ? 'footer' : route.query.section === 'about-card' ? 'about-card' : route.query.section === 'hero' ? 'hero' : route.query.section === 'skills' ? 'skills' : 'header')
  const sectionTitle = computed(() => ({ 'about-letters': 'Благодарственные письма', 'about-history': 'История компании', 'about-hero': 'Hero-компонент', 'contacts-form': 'Напишите нам', 'contacts-page': 'Контакты', 'not-found': 'Страница 404', 'objects-equipment': 'Обслуживаемое оборудование', 'objects-gallery': 'Фотографии с объекта', 'objects-results': 'Результаты', 'objects-other': 'Другие объекты', 'objects-request-card': 'Оставить заявку', 'objects-next-object': 'Следующий объект', 'objects': 'Общая объектов', 'objects-detail': 'Детальная страница объекта', 'services-included': 'Пункты услуги и их страницы', 'services-team': 'Команда', 'services-why-us': 'Почему мы', 'services-prices': 'Стоимость услуг', 'services-request': 'Оставьте заявку', 'services-detail': 'HeroSevicesDetail', 'services-help-card': 'HelpCard', services: 'Услуги', why: 'Почему мы', header: 'Хедер', hero: 'Hero', skills: 'Компетенции', 'about-card': 'AboutCard', footer: 'Footer', contacts: 'Контакты', faq: 'Вопросы', license: 'Лицензия', costs: 'Стоимость', 'how-work': 'Работа' })[section.value])
  const navigation = computed(() => [
    { label: 'Общие', icon: 'i-lucide-panels-top-left', defaultOpen: true, children: [
      { label: 'Хедер', icon: 'i-lucide-panel-top', to: '/admin', active: section.value === 'header' },
      { label: 'Страница 404', icon: 'i-lucide-file-question', to: '/admin?section=not-found', active: section.value === 'not-found' },
      { label: 'Footer', icon: 'i-lucide-panel-bottom', to: '/admin?section=footer', active: section.value === 'footer' }
    ] },
    { label: 'Home', icon: 'i-lucide-house', defaultOpen: true, children: [
      { label: 'Hero', icon: 'i-lucide-layout-template', to: '/admin?section=hero', active: section.value === 'hero' },
      { label: 'Компетенции', icon: 'i-lucide-boxes', to: '/admin?section=skills', active: section.value === 'skills' },
      { label: 'AboutCard', icon: 'i-lucide-building-2', to: '/admin?section=about-card', active: section.value === 'about-card' },
      { label: 'Почему мы', icon: 'i-lucide-badge-check', to: '/admin?section=why', active: section.value === 'why' },
      { label: 'Работа', icon: 'i-lucide-list-ordered', to: '/admin?section=how-work', active: section.value === 'how-work' },
      { label: 'Лицензия', icon: 'i-lucide-file-badge', to: '/admin?section=license', active: section.value === 'license' },
      { label: 'Стоимость', icon: 'i-lucide-calculator', to: '/admin?section=costs', active: section.value === 'costs' },
      { label: 'Вопросы', icon: 'i-lucide-circle-help', to: '/admin?section=faq', active: section.value === 'faq' },
      { label: 'Контакты', icon: 'i-lucide-map-pin', to: '/admin?section=contacts', active: section.value === 'contacts' }
    ] },
    { label: 'Объекты', icon: 'i-lucide-building-2', defaultOpen: true, children: [
      { label: 'Общая', icon: 'i-lucide-layout-template', defaultOpen: true, children: [
        { label: 'Общая объектов', to: '/admin?section=objects', active: section.value === 'objects' },
        { label: 'Следующий объект', to: '/admin?section=objects-next-object', active: section.value === 'objects-next-object' }
      ] },
      { label: 'Детальная', icon: 'i-lucide-file-text', defaultOpen: true, children: [
        { label: 'Детальная страница объекта', to: '/admin?section=objects-detail', active: section.value === 'objects-detail' },
        { label: 'Обслуживаемое оборудование', to: '/admin?section=objects-equipment', active: section.value === 'objects-equipment' },
        { label: 'Фотографии с объекта', to: '/admin?section=objects-gallery', active: section.value === 'objects-gallery' },
        { label: 'Результаты', to: '/admin?section=objects-results', active: section.value === 'objects-results' },
        { label: 'Другие объекты', to: '/admin?section=objects-other', active: section.value === 'objects-other' },
        { label: 'Оставить заявку', to: '/admin?section=objects-request-card', active: section.value === 'objects-request-card' }
      ] }
    ] },
    { label: 'О компании', icon: 'i-lucide-building-2', defaultOpen: true, children: [
      { label: 'Hero-компонент', to: '/admin?section=about-hero', active: section.value === 'about-hero' },
      { label: 'История компании', to: '/admin?section=about-history', active: section.value === 'about-history' },
      { label: 'Благодарственные письма', to: '/admin?section=about-letters', active: section.value === 'about-letters' }
    ] },
    { label: 'Контакты', icon: 'i-lucide-map-pin', defaultOpen: true, children: [
      { label: 'Контакты', to: '/admin?section=contacts-page', active: section.value === 'contacts-page' },
      { label: 'Напишите нам', to: '/admin?section=contacts-form', active: section.value === 'contacts-form' }
    ] },
    { label: 'Services', icon: 'i-lucide-grid-2x2', defaultOpen: true, children: [
      { label: 'Услуги', icon: 'i-lucide-layout-grid', to: '/admin?section=services', active: section.value === 'services' },
      { label: 'HelpCard', icon: 'i-lucide-message-circle-question-mark', to: '/admin?section=services-help-card', active: section.value === 'services-help-card' },
      { label: 'Детальная страница сервиса', icon: 'i-lucide-file-text', defaultOpen: true, children: [
        { label: 'Страница что входит в услугу', icon: 'i-lucide-files', defaultOpen: true, children: [
          { label: 'Пункты услуги и их страницы', to: '/admin?section=services-included', active: section.value === 'services-included' }
        ] },
        { label: 'HeroSevicesDetail', icon: 'i-lucide-layout-template', to: '/admin?section=services-detail', active: section.value === 'services-detail' },
        { label: 'Команда', icon: 'i-lucide-users', to: '/admin?section=services-team', active: section.value === 'services-team' },
        { label: 'Почему мы', icon: 'i-lucide-badge-check', to: '/admin?section=services-why-us', active: section.value === 'services-why-us' },
        { label: 'Стоимость услуг', icon: 'i-lucide-list', to: '/admin?section=services-prices', active: section.value === 'services-prices' },
        { label: 'Оставьте заявку', icon: 'i-lucide-send', to: '/admin?section=services-request', active: section.value === 'services-request' }
      ] }
    ] }
  ])
  useHead({ title: () => `${sectionTitle.value} · Vetro Admin`, meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
  return { ...auth, section, sectionTitle, navigation }
}
