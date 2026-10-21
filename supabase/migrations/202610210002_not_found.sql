BEGIN;
CREATE TABLE IF NOT EXISTS public.site_not_found (
  id text PRIMARY KEY CHECK (id = 'main'),
  content jsonb NOT NULL CHECK (jsonb_typeof(content) = 'object'),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_not_found ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_not_found FROM anon, authenticated;
GRANT SELECT ON public.site_not_found TO anon, authenticated;
GRANT ALL ON public.site_not_found TO service_role;
CREATE POLICY "Not found page is public" ON public.site_not_found FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_not_found (id, content) VALUES ('main', '{"title":"Такая страница не найдена","text":"Возможно, страница была удалена или вы перешли по неверному адресу","primaryLabel":"На главную","primaryHref":"/","secondaryLabel":"Каталог услуг","secondaryHref":"/services","showLogo":true}')
ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
