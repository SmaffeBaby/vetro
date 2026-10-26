export type PaginationItem = number | 'gap-before' | 'gap-after'

export function paginationItems(page: number, totalPages: number): PaginationItem[] {
  const total = Math.max(1, Math.trunc(totalPages))
  const current = Math.min(total, Math.max(1, Math.trunc(page)))
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1)
  const start = current <= 2 ? 1 : current >= total - 1 ? total - 2 : current - 1
  const end = Math.min(total, start + 2)
  const numbers = [...new Set([1, ...Array.from({ length: end - start + 1 }, (_, index) => start + index), total])]
  const result: PaginationItem[] = []
  for (const number of numbers) {
    const previous = result.at(-1)
    if (typeof previous === 'number' && number - previous > 1) {
      result.push(number - previous === 2 ? previous + 1 : number === total ? 'gap-after' : 'gap-before')
    }
    result.push(number)
  }
  return result
}
