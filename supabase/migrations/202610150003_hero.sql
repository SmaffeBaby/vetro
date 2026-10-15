BEGIN;
CREATE TABLE IF NOT EXISTS public.site_hero (
  id text PRIMARY KEY DEFAULT 'main' CHECK (id = 'main'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
  accent_title text NOT NULL DEFAULT '' CHECK (char_length(accent_title) <= 120),
  text text NOT NULL DEFAULT '' CHECK (char_length(text) <= 1000),
  regalia jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(regalia) = 'array' AND jsonb_array_length(regalia) <= 12),
  image_path text CHECK (image_path ~ '^Hero/[a-zA-Z0-9_-][a-zA-Z0-9_.-]{0,239}$'),
  image_filename text NOT NULL DEFAULT '',
  primary_button_label text NOT NULL CHECK (char_length(primary_button_label) BETWEEN 1 AND 60),
  secondary_button_label text NOT NULL CHECK (char_length(secondary_button_label) BETWEEN 1 AND 60),
  media_cleanup_paths jsonb NOT NULL DEFAULT '[]'::jsonb,
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_hero ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_hero FROM anon, authenticated;
GRANT SELECT ON public.site_hero TO anon, authenticated;
GRANT ALL ON public.site_hero TO service_role;
DROP POLICY IF EXISTS "Hero is public" ON public.site_hero;
CREATE POLICY "Hero is public" ON public.site_hero FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_hero (id, title, accent_title, regalia, primary_button_label, secondary_button_label)
VALUES ('main', E'Обслуживание\nинженерных систем', 'под ключ', '["15 лет опыта", "200+ объектов", "Собственная бригада"]'::jsonb, 'Рассчитать стоимость', 'Наши услуги')
ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
