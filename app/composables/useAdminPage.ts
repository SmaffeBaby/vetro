export function useAdminPage() {
  const auth = useAdminAuth()
  onMounted(auth.restore)
  const route = useRoute()
  const section = computed(() => route.query.section === 'hero' ? 'hero' : route.query.section === 'skills' ? 'skills' : 'header')
  const sectionTitle = computed(() => ({ header: 'Хедер', hero: 'Hero', skills: 'Компетенции' })[section.value])
  const navigation = computed(() => [
    { label: 'Хедер', icon: 'i-lucide-panel-top', to: '/admin', active: section.value === 'header' },
    { label: 'Hero', icon: 'i-lucide-layout-template', to: '/admin?section=hero', active: section.value === 'hero' },
    { label: 'Компетенции', icon: 'i-lucide-boxes', to: '/admin?section=skills', active: section.value === 'skills' }
  ])
  useHead({ title: () => `${sectionTitle.value} · Vetro Admin`, meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
  return { ...auth, section, sectionTitle, navigation }
}
