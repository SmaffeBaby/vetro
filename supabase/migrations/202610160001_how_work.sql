BEGIN;
CREATE TABLE IF NOT EXISTS public.site_how_work (
  id text PRIMARY KEY DEFAULT 'main' CHECK (id = 'main'),
  cards jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(cards) = 'array' AND jsonb_array_length(cards) <= 12),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_how_work ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_how_work FROM anon, authenticated;
GRANT SELECT ON public.site_how_work TO anon, authenticated;
GRANT ALL ON public.site_how_work TO service_role;
DROP POLICY IF EXISTS "Work is public" ON public.site_how_work;
CREATE POLICY "Work is public" ON public.site_how_work FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_how_work (id, cards) VALUES ('main', '[{"id":"request","sortOrder":10,"title":"Заявка\nи консультация","text":"Вы оставляете заявку или звоните нам. Наши специалисты проводят первичную консультацию, уточняют детали и согласовывают удобное время для выезда на объект."},{"id":"inspection","sortOrder":20,"title":"Выезд\nи обследование","text":"Специалисты выезжают на объект, оценивают состояние инженерных систем и определяют необходимые работы."},{"id":"proposal","sortOrder":30,"title":"Коммерческое\nпредложение","text":"Готовим предложение с перечнем работ, сроками и стоимостью обслуживания. Обсуждаем детали и отвечаем на ваши вопросы."},{"id":"agreement","sortOrder":40,"title":"Заключение\nдоговора","text":"Согласовываем условия сотрудничества и закрепляем в договоре состав работ, сроки и ответственность сторон."},{"id":"execution","sortOrder":50,"title":"Выполнение\nработ","text":"Выполняем согласованные работы и передаём результат с необходимой документацией."}]'::jsonb) ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
