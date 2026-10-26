import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

export function usePagedItems<T>(items: MaybeRefOrGetter<readonly T[]>, pageSize = 7) {
  const size = Math.max(1, Math.trunc(pageSize))
  const page = ref(1)
  const firstPage = ref(1)
  const total = computed(() => toValue(items).length)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size)))
  const hasMore = computed(() => page.value < totalPages.value)
  const visibleItems = computed(() => toValue(items).slice((firstPage.value - 1) * size, page.value * size))
  function selectPage(value: number) {
    page.value = Math.min(totalPages.value, Math.max(1, Math.trunc(value)))
    firstPage.value = page.value
  }
  function loadMore() { if (hasMore.value) page.value++ }
  watch(() => toValue(items), () => selectPage(1), { flush: 'sync' })
  return { page, total, totalPages, hasMore, visibleItems, selectPage, loadMore }
}
