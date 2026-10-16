export const MEDIA_BUCKET = 'Media'
export const MEDIA_MAX_BYTES = 5_000_000
export const mediaTypes: Record<string, string> = {
  'image/svg+xml': 'svg', 'image/png': 'png', 'image/jpeg': 'jpg',
  'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif'
}

const componentName = /^[A-Za-z][A-Za-z0-9_-]{0,79}$/
const homeComponents = new Set(['Hero', 'Skills', 'AboutCard', 'Why', 'HowWork', 'License', 'Costs', 'FAQ', 'Contacts'])
export function isMediaComponent(value: string): boolean {
  const parts = value.split('/')
  return parts.length === 1 ? componentName.test(value) : parts.length === 2 && ['Home', 'Services'].includes(parts[0]!) && componentName.test(parts[1]!)
}

/** Legacy component names still resolve to their page directory. Header and Footer are shared. */
export function mediaDirectory(component: string): string {
  return homeComponents.has(component) ? `Home/${component}` : component
}

export function isMediaPath(value: string): boolean {
  const parts = value.split('/')
  return (parts.length === 2 || parts.length === 3) && isMediaComponent(parts.slice(0, -1).join('/'))
    && /^[\p{L}\p{N}_-][\p{L}\p{N}_.-]{0,239}$/u.test(parts.at(-1)!)
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
