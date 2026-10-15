export function useAdminPage() {
  const auth = useAdminAuth()
  onMounted(auth.restore)
  useHead({ title: 'Хедер · Vetro Admin', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
  return auth
}
