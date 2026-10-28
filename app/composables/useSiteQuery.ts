import { useQuery } from '@tanstack/vue-query'
import type { FetchError } from 'ofetch'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

interface SiteQueryResult<T> {
  data: ComputedRef<T>
  error: Ref<FetchError | null>
  pending: Ref<boolean>
  refresh: () => Promise<unknown>
}
type SiteQuery<T> = SiteQueryResult<T> & Promise<SiteQueryResult<T>>

export function useSiteQuery<T>(url: MaybeRefOrGetter<string>, options: { default: () => T; retry?: number }): SiteQuery<T>
export function useSiteQuery<T>(url: MaybeRefOrGetter<string>, options?: { retry?: number }): SiteQuery<T | undefined>

/** Public content shared by URL, including SSR hydration and reactive route IDs. */
export function useSiteQuery<T>(url: MaybeRefOrGetter<string>, options: { default?: () => T; retry?: number } = {}): SiteQuery<T | undefined> {
  const requestFetch = useRequestFetch()
  const query = useQuery<T, FetchError>({
    queryKey: computed(() => ['site', toValue(url)]),
    queryFn: ({ queryKey, signal }) => requestFetch<T>(queryKey[1] as string, { signal, retry: 0 }) as Promise<T>,
    ...(options.retry === undefined ? {} : { retry: options.retry })
  })
  // Defaults remain visible on failures without becoming successful cache entries.
  const data = computed(() => query.data.value ?? options.default?.()) as ComputedRef<T | undefined>
  const result = { data, error: query.error, refresh: query.refetch, pending: query.isPending }
  // Like Nuxt's useFetch, expose refs immediately and allow awaiting the first read.
  // Create all effects synchronously so they belong to the component's scope.
  return Object.assign(query.suspense().catch(() => undefined).then(() => result), result)
}
