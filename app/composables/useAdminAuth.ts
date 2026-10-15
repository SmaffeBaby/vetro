interface AdminIdentity { id: string; email?: string }

export function useAdminAuth() {
  const { $supabase } = useNuxtApp()
  const identity = useState<AdminIdentity | null>('site-admin', () => null)
  const checking = useState('site-admin-checking', () => true)
  const pending = ref(false)
  const error = ref('')
  const credentials = reactive({ email: '', password: '' })

  async function adminFetch<T>(url: string, options: { method?: 'PUT' | 'POST' | 'DELETE'; body?: Record<string, unknown> | FormData } = {}): Promise<T> {
    const { data } = await $supabase.auth.getSession()
    if (!data.session) throw new Error('Сессия завершилась. Войдите снова.')
    return await $fetch(url, { ...options, headers: { Authorization: `Bearer ${data.session.access_token}` } }) as T
  }
  async function restore() {
    checking.value = true
    try { identity.value = await adminFetch<AdminIdentity>('/api/admin/me') } catch { identity.value = null }
    finally { checking.value = false }
  }
  async function login() {
    pending.value = true
    error.value = ''
    try {
      const { error: authError } = await $supabase.auth.signInWithPassword({ email: credentials.email.trim(), password: credentials.password })
      if (authError) throw new Error('Неверный email или пароль.')
      try { identity.value = await adminFetch<AdminIdentity>('/api/admin/me') } catch {
        await $supabase.auth.signOut()
        throw new Error('У этой учётной записи нет доступа к панели управления.')
      }
      credentials.password = ''
    } catch (e) { error.value = (e as Error).message }
    finally { pending.value = false }
  }
  async function logout() {
    const { error: signOutError } = await $supabase.auth.signOut()
    if (signOutError) { error.value = 'Не удалось выйти. Попробуйте ещё раз.'; return }
    identity.value = null
    credentials.password = ''
    clearNuxtData('site-header')
  }
  return { identity, checking, pending, error, credentials, restore, login, logout, adminFetch }
}
