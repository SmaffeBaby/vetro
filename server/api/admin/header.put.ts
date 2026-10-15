import { headerInputSchema } from '../../../shared/utils/header'

export default defineEventHandler(async (event) => {
  const { client } = await requireSiteAdmin(event)
  const parsed = headerInputSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid header settings', data: { message: parsed.error.issues[0]?.message } })
  }
  let svg: string
  try { svg = validateLogoSvg(parsed.data.logoSvg) } catch (error) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid SVG', data: { message: (error as Error).message } })
  }
  const { data, error } = await client.from('site_header').update({
    logo_svg: svg,
    menu_items: parsed.data.menuItems,
    button_label: parsed.data.buttonLabel,
    revision: parsed.data.revision + 1,
    updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision)
    .select('logo_svg, menu_items, button_label, revision, updated_at').maybeSingle()
  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to save header' })
  if (!data) throw createError({ statusCode: 409, statusMessage: 'Settings changed', data: { message: 'Настройки уже изменились. Загрузите актуальную версию перед сохранением.' } })
  return serializeHeader(data)
})
