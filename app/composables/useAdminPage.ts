export function useAdminPage() {
  const auth = useAdminAuth()
  onMounted(auth.restore)
  const route = useRoute()
  const section = computed(() => route.query.section === 'services-detail' ? 'services-detail' : route.query.section === 'services-help-card' ? 'services-help-card' : route.query.section === 'services' ? 'services' : route.query.section === 'why' ? 'why' : route.query.section === 'how-work' ? 'how-work' : route.query.section === 'license' ? 'license' : route.query.section === 'costs' ? 'costs' : route.query.section === 'faq' ? 'faq' : route.query.section === 'contacts' ? 'contacts' : route.query.section === 'footer' ? 'footer' : route.query.section === 'about-card' ? 'about-card' : route.query.section === 'hero' ? 'hero' : route.query.section === 'skills' ? 'skills' : 'header')
  const sectionTitle = computed(() => ({ 'services-detail': 'HeroSevicesDetail', 'services-help-card': 'HelpCard', services: 'Услуги', why: 'Почему мы', header: 'Хедер', hero: 'Hero', skills: 'Компетенции', 'about-card': 'AboutCard', footer: 'Footer', contacts: 'Контакты', faq: 'Вопросы', license: 'Лицензия', costs: 'Стоимость', 'how-work': 'Работа' })[section.value])
  const navigation = computed(() => [
    { label: 'Общие', icon: 'i-lucide-panels-top-left', defaultOpen: true, children: [
      { label: 'Хедер', icon: 'i-lucide-panel-top', to: '/admin', active: section.value === 'header' },
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
    { label: 'Services', icon: 'i-lucide-grid-2x2', defaultOpen: true, children: [
      { label: 'Услуги', icon: 'i-lucide-layout-grid', to: '/admin?section=services', active: section.value === 'services' },
      { label: 'HelpCard', icon: 'i-lucide-message-circle-question-mark', to: '/admin?section=services-help-card', active: section.value === 'services-help-card' },
      { label: 'Детальная страница сервисов', icon: 'i-lucide-file-text', defaultOpen: true, children: [
        { label: 'HeroSevicesDetail', icon: 'i-lucide-layout-template', to: '/admin?section=services-detail', active: section.value === 'services-detail' }
      ] }
    ] }
  ])
  useHead({ title: () => `${sectionTitle.value} · Vetro Admin`, meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
  return { ...auth, section, sectionTitle, navigation }
}
