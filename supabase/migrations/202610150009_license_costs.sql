BEGIN;
CREATE TABLE IF NOT EXISTS public.site_license (
  id text PRIMARY KEY DEFAULT 'main' CHECK (id = 'main'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
  button_label text NOT NULL CHECK (char_length(button_label) BETWEEN 1 AND 60),
  image_path text CHECK (image_path ~ '^License/[a-zA-Z0-9_-][a-zA-Z0-9_.-]{0,239}$'),
  image_filename text NOT NULL DEFAULT '',
  media_cleanup_paths jsonb NOT NULL DEFAULT '[]'::jsonb,
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.site_costs (
  id text PRIMARY KEY DEFAULT 'main' CHECK (id = 'main'),
  fields jsonb NOT NULL CHECK (jsonb_typeof(fields) = 'array' AND jsonb_array_length(fields) BETWEEN 1 AND 12),
  button_label text NOT NULL CHECK (char_length(button_label) BETWEEN 1 AND 60),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_license ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_costs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_license, public.site_costs FROM anon, authenticated;
GRANT SELECT ON public.site_license, public.site_costs TO anon, authenticated;
GRANT ALL ON public.site_license, public.site_costs TO service_role;
DROP POLICY IF EXISTS "License is public" ON public.site_license;
CREATE POLICY "License is public" ON public.site_license FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Costs are public" ON public.site_costs;
CREATE POLICY "Costs are public" ON public.site_costs FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_license (id, title, button_label) VALUES ('main', 'Лицензия
№78-Б/03222', 'Запросить копии') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.site_costs (id, fields, button_label) VALUES ('main', '[{"id":"system","label":"Тип системы","options":["ИТП","УУТЭ","Комплексное обслуживание"]},{"id":"object","label":"Тип объекта","options":["Коммерческий объект","Промышленный объект","Жилое здание"]},{"id":"area","label":"Площадь / Число этажей","options":["До 500 м²","500–2000 м²","Более 2000 м²"]},{"id":"contact","label":"Контактная информация","options":["По телефону","По электронной почте"]}]'::jsonb, 'Получить расчёт') ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
