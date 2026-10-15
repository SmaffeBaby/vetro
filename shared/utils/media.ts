export const MEDIA_BUCKET = 'Media'
export const MEDIA_MAX_BYTES = 5_000_000
export const mediaTypes: Record<string, string> = {
  'image/svg+xml': 'svg', 'image/png': 'png', 'image/jpeg': 'jpg',
  'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif'
}

export function isMediaComponent(value: string): boolean {
  return /^[A-Za-z][A-Za-z0-9_-]{0,79}$/.test(value)
}

export function isMediaPath(value: string): boolean {
  const parts = value.split('/')
  return parts.length === 2 && isMediaComponent(parts[0]!)
    && /^[\p{L}\p{N}_-][\p{L}\p{N}_.-]{0,239}$/u.test(parts[1]!)
}

export function mediaFilename(name: string, extension: string): string {
  const russian: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
    х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
  }
  const stem = name.split(/[\\/]/).pop()!.replace(/\.[^.]*$/, '')
    .replace(/[а-яё]/gi, letter => {
      const replacement = russian[letter.toLowerCase()]!
      return letter === letter.toUpperCase() ? replacement.toUpperCase() : replacement
    })
    .normalize('NFKD').replace(/\p{M}/gu, '').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120)
  return `${stem || 'image'}.${extension}`
}

export function mediaUrl(path: string): string {
  return `/supabase/storage/v1/object/public/${MEDIA_BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`
}
