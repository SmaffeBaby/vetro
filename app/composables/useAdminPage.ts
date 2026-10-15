export function useAdminPage() {
  const auth = useAdminAuth()
  onMounted(auth.restore)
  const route = useRoute()
  const section = computed(() => route.query.section === 'contacts' ? 'contacts' : route.query.section === 'footer' ? 'footer' : route.query.section === 'about-card' ? 'about-card' : route.query.section === 'hero' ? 'hero' : route.query.section === 'skills' ? 'skills' : 'header')
  const sectionTitle = computed(() => ({ header: 'Хедер', hero: 'Hero', skills: 'Компетенции', 'about-card': 'AboutCard', footer: 'Footer', contacts: 'Контакты' })[section.value])
  const navigation = computed(() => [
    { label: 'Хедер', icon: 'i-lucide-panel-top', to: '/admin', active: section.value === 'header' },
    { label: 'Hero', icon: 'i-lucide-layout-template', to: '/admin?section=hero', active: section.value === 'hero' },
    { label: 'Компетенции', icon: 'i-lucide-boxes', to: '/admin?section=skills', active: section.value === 'skills' },
    { label: 'AboutCard', icon: 'i-lucide-building-2', to: '/admin?section=about-card', active: section.value === 'about-card' },
    { label: 'Контакты', icon: 'i-lucide-map-pin', to: '/admin?section=contacts', active: section.value === 'contacts' },
    { label: 'Footer', icon: 'i-lucide-panel-bottom', to: '/admin?section=footer', active: section.value === 'footer' }
  ])
  useHead({ title: () => `${sectionTitle.value} · Vetro Admin`, meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
  return { ...auth, section, sectionTitle, navigation }
}
