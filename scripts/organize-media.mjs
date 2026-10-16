import { createHash, randomUUID } from 'node:crypto'

// Copy and verify first, publish settings with revision checks, then remove old objects.
// Rerunning resumes safely after a conflict or an interrupted copy.
const base = process.env.NUXT_SUPABASE_URL
const key = process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY
if (!base || !key) throw new Error('Supabase environment is required')
const headers = { apikey: key, Authorization: `Bearer ${key}` }
const tables = ['site_header', 'site_hero', 'site_skills', 'site_about_card', 'site_why', 'site_how_work', 'site_license', 'site_costs', 'site_faq', 'site_contacts', 'site_footer', 'site_services']
const home = ['Hero', 'Skills', 'AboutCard', 'Why', 'HowWork', 'License', 'Costs', 'FAQ', 'Contacts']
async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, { ...options, headers: { ...headers, ...options.headers } })
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}))
    throw new Error(`Supabase request failed (${response.status}): ${path.split('?')[0]}${detail.message ? ` — ${detail.message}` : ''}`)
  }
  return response
}
const jsonHeaders = { 'Content-Type': 'application/json' }
const objectUrl = path => `/storage/v1/object/Media/${path.split('/').map(encodeURIComponent).join('/')}`
async function rows() {
  return Object.fromEntries(await Promise.all(tables.map(async table => {
    const [row] = await (await request(`/rest/v1/${table}?id=eq.main&select=*`)).json()
    if (!row) throw new Error(`Missing settings: ${table}`)
    return [table, row]
  })))
}
async function list(prefix) {
  const result = []
  for (let offset = 0; ; offset += 100) {
    const page = await (await request('/storage/v1/object/list/Media', { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ prefix, limit: 100, offset, sortBy: { column: 'name', order: 'asc' } }) })).json()
    for (const entry of page) {
      const path = `${prefix}/${entry.name}`
      if (entry.id) result.push(path)
      else result.push(...await list(path))
    }
    if (page.length < 100) return result
  }
}
const before = await rows()
const sources = (await Promise.all(home.map(component => list(component)))).flat()
const mappings = Object.fromEntries(sources.map(path => [path, `Home/${path}`]))
if (process.argv.includes('--plan')) {
  console.log(JSON.stringify({ createdAt: new Date().toISOString(), mappings, settings: before }, null, 2))
} else {
  const hash = bytes => createHash('sha256').update(bytes).digest('hex')
  for (const source of sources) {
    const target = mappings[source]
    const original = await (await request(objectUrl(source))).arrayBuffer()
    const existing = await fetch(`${base}${objectUrl(target)}`, { headers })
    if (existing.status === 404 || existing.status === 400) {
      await request('/storage/v1/object/copy', { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ bucketId: 'Media', sourceKey: source, destinationKey: target }) })
    } else if (!existing.ok) throw new Error(`Cannot inspect destination: ${target}`)
    const copied = await (await request(objectUrl(target))).arrayBuffer()
    if (hash(new Uint8Array(original)) !== hash(new Uint8Array(copied))) throw new Error(`Copy verification failed: ${source}`)
  }
  function relocate(value) {
    if (typeof value === 'string') {
      if (mappings[value]) return mappings[value]
      for (const [source, target] of Object.entries(mappings)) value = value.replaceAll(`/Media/${source}`, `/Media/${target}`)
      return value
    }
    if (Array.isArray(value)) return value.map(relocate)
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, relocate(item)]))
    return value
  }
  for (const [table, row] of Object.entries(before)) {
    const relocated = relocate(row)
    const patch = Object.fromEntries(Object.keys(row).filter(key => !['id', 'revision', 'updated_at'].includes(key) && JSON.stringify(row[key]) !== JSON.stringify(relocated[key])).map(key => [key, relocated[key]]))
    if (!Object.keys(patch).length) continue
    const changed = await (await request(`/rest/v1/${table}?id=eq.main&revision=eq.${row.revision}`, { method: 'PATCH', headers: { ...jsonHeaders, Prefer: 'return=representation' }, body: JSON.stringify({ ...patch, revision: Number(row.revision) + 1, updated_at: new Date().toISOString() }) })).json()
    if (!changed.length) throw new Error(`Settings changed: ${table}. Old files retained; rerun to resume.`)
  }
  const published = await rows()
  if (JSON.stringify(relocate(published)) !== JSON.stringify(published)) throw new Error('Old media references remain; old files retained')
  if (sources.length) {
    await request('/storage/v1/object/Media', { method: 'DELETE', headers: jsonHeaders, body: JSON.stringify({ prefixes: sources }) })
    const remaining = (await Promise.all(home.map(component => list(component)))).flat()
    if (remaining.length) throw new Error(`Old objects remain: ${remaining.length}. Rerun to resume.`)
  }
  console.log(`Home media relocated and verified: ${sources.length}`)
  // Publish seeded service icons in their page directory. Subsequent runs leave them alone.
  const services = published.site_services
  const uploaded = []
  try {
    for (const card of services.cards) {
      if (!card.svg || card.iconPath) continue
      const path = `Services/Cards/${card.id}-${randomUUID()}.svg`
      await request(objectUrl(path), { method: 'POST', headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'max-age=31536000' }, body: card.svg })
      uploaded.push(path); card.iconPath = path
    }
    if (uploaded.length) {
      const changed = await (await request(`/rest/v1/site_services?id=eq.main&revision=eq.${services.revision}`, { method: 'PATCH', headers: { ...jsonHeaders, Prefer: 'return=representation' }, body: JSON.stringify({ cards: services.cards, revision: Number(services.revision) + 1, updated_at: new Date().toISOString() }) })).json()
      if (!changed.length) throw new Error('Services changed during icon publication')
    }
    console.log(`Services icons uploaded: ${uploaded.length}`)
  } catch (error) {
    if (uploaded.length) await request('/storage/v1/object/Media', { method: 'DELETE', headers: jsonHeaders, body: JSON.stringify({ prefixes: uploaded }) })
    throw error
  }
}
