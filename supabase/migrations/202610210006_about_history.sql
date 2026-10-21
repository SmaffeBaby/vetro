BEGIN;
CREATE TABLE IF NOT EXISTS public.site_about_history (
  id text PRIMARY KEY CHECK (id = 'main'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
  cards jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(cards) = 'array' AND jsonb_array_length(cards) <= 50),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_about_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_about_history FROM anon, authenticated;
GRANT SELECT ON public.site_about_history TO anon, authenticated;
GRANT ALL ON public.site_about_history TO service_role;
CREATE POLICY "Company history is public" ON public.site_about_history FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_about_history (id, title, cards) VALUES ('main', 'История компании', '[{"id":"foundation","year":"2012","description":"Основание компании, первые проекты по системам безопасности"},{"id":"licenses","year":"2014","description":"Получение лицензии МЧС и допуска СРО"},{"id":"team","year":"2016","description":"Расширение штата до 20 специалистов"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
