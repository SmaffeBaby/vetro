BEGIN;
CREATE TABLE IF NOT EXISTS public.site_services_detail (
 service_id text PRIMARY KEY CHECK (service_id ~ '^[a-zA-Z0-9_-]{1,80}$'),
 title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
 text text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 4000),
 button_label text NOT NULL CHECK (char_length(button_label) BETWEEN 1 AND 80),
 svg text NOT NULL DEFAULT '',
 image_path text CHECK (image_path ~ '^Services/DetailServices/HeroSevicesDetail/[a-zA-Z0-9_-][a-zA-Z0-9_.-]{0,239}$'),
 filename text NOT NULL DEFAULT 'background.svg',
 media_cleanup_paths jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(media_cleanup_paths) = 'array'),
 revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_services_detail ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_services_detail FROM anon, authenticated;
GRANT SELECT ON public.site_services_detail TO anon, authenticated;
GRANT ALL ON public.site_services_detail TO service_role;
CREATE POLICY "Service detail is public" ON public.site_services_detail FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_services_detail (service_id, title, text, button_label, svg, filename)
SELECT card->>'id', card->>'title', CASE WHEN card->>'id' = 'security' THEN 'Пожарная и охранная сигнализация, СОУЭ, видеонаблюдение, тревожная сигнализация, СКУД, системы противодымной защиты, внутренний противопожарный водопровод и система контроля загазованности.' ELSE card->>'text' END,
 'Оставить заявку', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" fill="none"><path d="M8 65V34L53 14L94 32M8 55H72C85 55 94 65 94 79C94 92 84 102 72 102H33C19 102 8 91 8 77V72" stroke="#2a9ccf" stroke-width="14" stroke-linejoin="round"/></svg>', (card->>'id') || '-background.svg'
FROM public.site_services, jsonb_array_elements(cards) AS card WHERE id = 'main'
ON CONFLICT (service_id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
