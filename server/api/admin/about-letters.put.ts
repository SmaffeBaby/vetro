import { aboutLettersInputSchema } from '../../../shared/utils/about-letters'
export default defineEventHandler(async event => {
  const { client } = await requireSiteAdmin(event)
  const parsed = aboutLettersInputSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, data: { message: parsed.error.issues[0]?.message } })
  const { data, error } = await client.from('site_about_letters').update({
    title: parsed.data.title, cards: parsed.data.cards, revision: parsed.data.revision + 1, updated_at: new Date().toISOString()
  }).eq('id', 'main').eq('revision', parsed.data.revision).select('*').maybeSingle()
  if (error) throw createError({ statusCode: 503, data: { message: 'Не удалось сохранить благодарственные письма.' } })
  if (!data) throw createError({ statusCode: 409, data: { message: 'Благодарственные письма уже изменены. Загрузите актуальную версию перед сохранением.' } })
  return serializeAboutLetters(data)
})
