import { z } from 'zod'
import { isSafeMenuHref } from './header'
import { parseFooterCode } from './footer-code'
import type { FooterColumn } from '../types/footer'

const id = z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/, 'Некорректный ID элемента')
export const footerEntrySchema = z.object({
  id,
  mode: z.enum(['text', 'link', 'code']),
  text: z.string().trim().max(2000, 'Текст: максимум 2000 символов'),
  href: z.string().trim().max(2048, 'Ссылка: максимум 2048 символов'),
  code: z.string().trim().max(10_000, 'HTML: максимум 10000 символов'),
  highlight: z.string().trim().max(200, 'Выделение: максимум 200 символов')
}).superRefine((item, ctx) => {
  const issue = (path: string, message: string) => ctx.addIssue({ code: 'custom', path: [path], message })
  if (item.mode !== 'code' && !item.text) issue('text', 'Введите текст пункта')
  if (item.mode === 'link' && !isSafeMenuHref(item.href)) issue('href', 'Укажите путь /page, #anchor, https://, mailto: или tel:')
  if (item.mode === 'link' && item.highlight && !item.text.includes(item.highlight)) issue('highlight', 'Выделяемое слово должно присутствовать в тексте')
  if (item.mode === 'code') {
    if (!item.code) issue('code', 'Введите HTML-код')
    else { try { parseFooterCode(item.code) } catch (e) { issue('code', (e as Error).message) } }
  }
})
const entries = z.array(footerEntrySchema).max(20, 'Максимум 20 пунктов').refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID пунктов должны быть уникальными')
export const footerInputSchema = z.object({
  logoSvg: z.string().trim().max(200_000, 'SVG: максимум 200 КБ'),
  logoFilename: z.string().trim().max(180).default('logo.svg'),
  text: z.string().trim().max(2000, 'Текст слева: максимум 2000 символов'),
  columns: z.array(z.object({ id, title: z.string().trim().min(1, 'Введите название колонки').max(120), sortOrder: z.number().int().min(0).max(999999), items: entries }))
    .max(8, 'Максимум 8 колонок').refine(items => new Set(items.map(item => item.id)).size === items.length, 'ID колонок должны быть уникальными'),
  buttonLabel: z.string().trim().min(1, 'Введите текст кнопки').max(60),
  leftBottom: entries,
  rightBottom: entries,
  revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1)
})
export function sortFooterColumns(columns: readonly FooterColumn[]) {
  return [...columns].sort((a, b) => a.sortOrder - b.sortOrder)
}
