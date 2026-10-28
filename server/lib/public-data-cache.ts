/** Bounded process cache. Pending reads are shared; failed reads are never kept. */
export function createPublicDataCache({ maxAge = 60_000, maxEntries = 256, now = Date.now } = {}) {
  const entries = new Map<string, { expires: number; value: Promise<unknown> }>()
  return {
    async read<T>(key: string, load: () => Promise<T>): Promise<T> {
      const cached = entries.get(key)
      if (cached && cached.expires > now()) return cached.value as Promise<T>
      entries.delete(key)
      while (entries.size >= maxEntries) entries.delete(entries.keys().next().value!)
      const entry = { expires: Infinity, value: Promise.resolve().then(load) as Promise<unknown> }
      entries.set(key, entry)
      try {
        const value = await entry.value
        entry.expires = now() + maxAge
        return value as T
      } catch (error) {
        // A save or newer read may already have replaced this pending entry.
        if (entries.get(key) === entry) entries.delete(key)
        throw error
      }
    },
    invalidate() {
      // In-flight reads retain their own entry and cannot repopulate this Map.
      entries.clear()
    }
  }
}
