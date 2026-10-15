import { XMLParser, XMLValidator } from 'fast-xml-parser'

const allowedTags = new Set([
  'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
  'defs', 'linearGradient', 'radialGradient', 'stop', 'clipPath', 'mask',
  'title', 'desc', 'pattern', 'use', 'text', 'tspan'
])

// SVG is served as an image, never inserted as HTML. Also reject active/external content at save time.
export function validateLogoSvg(value: string): string {
  const svg = value.trim().replace(/^<\?xml[^?]*\?>\s*/i, '')
  if (Buffer.byteLength(svg, 'utf8') > 200_000) throw new Error('SVG должен быть меньше 200 КБ')
  if (/<!DOCTYPE|<!ENTITY|<\?/i.test(svg) || XMLValidator.validate(svg) !== true) {
    throw new Error('Некорректный SVG: требуется самостоятельный XML-документ без DTD и сущностей')
  }
  const nodes = new XMLParser({ preserveOrder: true, ignoreAttributes: false, processEntities: false }).parse(svg)
  if (nodes.length !== 1 || !Array.isArray(nodes[0]?.svg)) throw new Error('Корневой элемент должен быть <svg>')

  let count = 0
  function walk(items: Record<string, unknown>[], depth: number) {
    if (depth > 50) throw new Error('Слишком большая вложенность SVG')
    for (const node of items) {
      if (++count > 10_000) throw new Error('SVG содержит слишком много элементов')
      for (const [tag, children] of Object.entries(node)) {
        if (tag === ':@' || tag === '#text') continue
        if (!allowedTags.has(tag)) throw new Error(`Элемент <${tag}> не разрешён в логотипе`)
        if (Array.isArray(children)) walk(children, depth + 1)
      }
      for (const [key, raw] of Object.entries((node[':@'] ?? {}) as Record<string, unknown>)) {
        const name = key.replace(/^@_/, '')
        const text = String(raw)
        if (/^on/i.test(name) || /javascript:|data:|https?:\/\//i.test(text) && name !== 'xmlns' && name !== 'xmlns:xlink') {
          throw new Error('SVG не должен содержать обработчики событий и внешние ресурсы')
        }
        if (name === 'href' || name === 'xlink:href') {
          if (!/^#[a-zA-Z_][\w:.-]*$/.test(text)) throw new Error('Ссылки SVG должны указывать на внутренний #id')
        }
        if (/url\s*\(/i.test(text.replace(/url\(\s*['"]?#[\w:.-]+['"]?\s*\)/gi, ''))) {
          throw new Error('Внешние URL в SVG запрещены')
        }
        if (/expression\s*\(|@import|\\/i.test(text)) throw new Error('Активные стили SVG запрещены')
      }
    }
  }
  walk(nodes, 0)
  const attributes = nodes[0][':@'] ?? {}
  const viewBox = String(attributes['@_viewBox'] ?? '').trim().split(/[\s,]+/).map(Number)
  const width = parseFloat(String(attributes['@_width'] ?? ''))
  const height = parseFloat(String(attributes['@_height'] ?? ''))
  if (!(viewBox.length === 4 && viewBox.every(Number.isFinite) && viewBox[2]! > 0 && viewBox[3]! > 0) && !(width > 0 && height > 0)) {
    throw new Error('Укажите viewBox или положительные width и height у SVG')
  }
  return svg
}
