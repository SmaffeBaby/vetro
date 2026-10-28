import { QueryClient, VueQueryPlugin, dehydrate, hydrate, type DehydratedState } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  // A separate client per SSR request prevents data leaking between visitors.
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: import.meta.server ? Infinity : 10 * 60_000,
        refetchOnWindowFocus: false,
        retry: (count, error) => {
          const status = (error as { statusCode?: number }).statusCode
          return import.meta.client && count < 1 && (!status || status >= 500)
        }
      },
      mutations: { retry: false }
    }
  })
  const state = useState<DehydratedState | null>('vue-query', () => null)
  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
  if (import.meta.client && state.value) hydrate(queryClient, state.value)
  if (import.meta.server) {
    nuxtApp.hook('app:rendered', () => {
      // Authenticated requests never belong in a public HTML payload.
      state.value = dehydrate(queryClient, { shouldDehydrateQuery: query => query.queryKey[0] === 'site' && query.state.status === 'success' })
      queryClient.clear()
    })
  }
  // Publication in an admin tab also refreshes an already open public tab.
  const channel = import.meta.client && typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('vetro-content') : null
  if (channel) {
    channel.onmessage = async () => {
      await queryClient.cancelQueries({ queryKey: ['site'] })
      await queryClient.invalidateQueries({ queryKey: ['site'] })
    }
    nuxtApp.vueApp.onUnmount(() => channel.close())
  }
  return { provide: { queryClient, publishContentChange: () => channel?.postMessage('published') } }
})
