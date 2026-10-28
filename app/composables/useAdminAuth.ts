import { useMutation } from '@tanstack/vue-query'

interface AdminIdentity { id: string; email?: string }
type AdminFetchOptions = { method?: 'PUT' | 'POST' | 'DELETE'; body?: Record<string, unknown> | FormData }

export function useAdminAuth() {
  const { $supabase, $queryClient, $publishContentChange } = useNuxtApp()
  const identity = useState<AdminIdentity | null>('site-admin', () => null)
  const checking = useState('site-admin-checking', () => true)
  const pending = ref(false)
  const error = ref('')
  const credentials = reactive({ email: '', password: '' })

  function contentFetch<T>(url: string): Promise<T> {
    return $queryClient.fetchQuery<T>({
      queryKey: ['site', url],
      staleTime: 0,
      retry: false,
      queryFn: ({ signal }) => $fetch(url, { signal, retry: 0 }) as Promise<T>
    })
  }

  const mutation = useMutation({
    mutationFn: ({ url, options, token }: { url: string; options: AdminFetchOptions; token: string }) =>
      $fetch(url, { ...options, retry: 0, headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: async () => {
      await $queryClient.cancelQueries()
      await $queryClient.invalidateQueries()
      $publishContentChange()
    }
  })

  async function adminFetch<T>(url: string, options: AdminFetchOptions = {}): Promise<T> {
    const { data } = await $supabase.auth.getSession()
    if (!data.session) throw new Error('Сессия завершилась. Войдите снова.')
    const token = data.session.access_token
    if (options.method) return await mutation.mutateAsync({ url, options, token }) as T
    return $queryClient.fetchQuery<T>({
      queryKey: ['admin', data.session.user.id, url],
      // Explicit editor reloads always get the latest revision; concurrent reads share a request.
      staleTime: 0,
      retry: false,
      queryFn: ({ signal }) => $fetch(url, { signal, retry: 0, headers: { Authorization: `Bearer ${token}` } }) as Promise<T>
    })
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
    await $queryClient.cancelQueries({ queryKey: ['admin'] })
    $queryClient.removeQueries({ queryKey: ['admin'] })
  }
  return { identity, checking, pending, error, credentials, restore, login, logout, adminFetch, contentFetch }
}
