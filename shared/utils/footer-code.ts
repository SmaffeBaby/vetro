import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { isSafeMenuHref } from './header'
import type { FooterCodeNode } from '../types/footer'

const tags = new Set(['a', 'span', 'strong', 'b', 'em', 'i', 'u', 'br', 'p', 'ul', 'ol', 'li'])

/** Convert the supported HTML subset to Vue-rendered nodes; never execute or insert raw HTML. */
export function parseFooterCode(code: string): FooterCodeNode[] {
  if (!code.trim()) return []
  if (code.length > 10_000 || /<!|<\?/i.test(code)) throw new Error('HTML: максимум 10000 символов, без DTD, комментариев и инструкций')
  const wrapped = `<root>${code.replace(/<br\s*>/gi, '<br/>').replace(/&nbsp;/g, '&#160;').replace(/&copy;/g, '&#169;')}</root>`
  if (XMLValidator.validate(wrapped) !== true) throw new Error('Проверьте HTML: закройте теги и заключите атрибуты в кавычки')
  const nodes = new XMLParser({ preserveOrder: true, ignoreAttributes: false, parseTagValue: false, trimValues: false, processEntities: true }).parse(wrapped)
  let count = 0
  function walk(items: Record<string, unknown>[], depth: number): FooterCodeNode[] {
    if (depth > 12) throw new Error('HTML: слишком большая вложенность')
    return items.map(node => {
      if (++count > 300) throw new Error('HTML: слишком много элементов')
      if ('#text' in node) return { text: String(node['#text']) }
      const tag = Object.keys(node).find(key => key !== ':@')!
      if (!tags.has(tag)) throw new Error(`HTML: тег <${tag}> не поддерживается`)
      const attributes = (node[':@'] ?? {}) as Record<string, unknown>
      const result: FooterCodeNode = { tag, children: walk((node[tag] || []) as Record<string, unknown>[], depth + 1) }
      for (const [key, value] of Object.entries(attributes)) {
        const name = key.replace(/^@_/, '')
        if (name === 'title') result.title = String(value)
        else if (tag === 'a' && name === 'href' && isSafeMenuHref(String(value))) result.href = String(value)
        else if (tag === 'a' && name === 'target' && ['_blank', '_self'].includes(String(value))) result.target = value as '_blank' | '_self'
        else throw new Error(`HTML: атрибут ${name} не поддерживается или ссылка некорректна`)
      }
      if (tag === 'a' && !result.href) throw new Error('HTML: у ссылки должен быть href')
      return result
    })
  }
  return walk(nodes[0].root, 0)
}

export function footerYearText(value: string, year: number): string {
  return value.replace(/\{\{\s*year\s*\}\}/g, String(year))
}

export function footerLinkParts(text: string, highlight: string) {
  const index = highlight ? text.indexOf(highlight) : -1
  return index < 0 ? null : { before: text.slice(0, index), word: highlight, after: text.slice(index + highlight.length) }
}
