BEGIN;
CREATE TABLE IF NOT EXISTS public.site_about_hero (
  id text PRIMARY KEY CHECK (id = 'main'),
  content jsonb NOT NULL CHECK (jsonb_typeof(content) = 'object'),
  image_path text,
  image_filename text NOT NULL DEFAULT '',
  media_cleanup_paths jsonb NOT NULL DEFAULT '[]'::jsonb,
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_about_hero ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_about_hero FROM anon, authenticated;
GRANT SELECT ON public.site_about_hero TO anon, authenticated;
GRANT ALL ON public.site_about_hero TO service_role;
CREATE POLICY "About hero is public" ON public.site_about_hero FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_about_hero (id, content, image_path, image_filename) VALUES ('main', $about${"title": "О компании", "breadcrumb": "О компании", "subtitle": "Профессиональная\nинженерия", "text": "Мы предоставляем полный цикл инженерных услуг — от проектирования до регулярного технического обслуживания. Обеспечиваем комплексную безопасность, надежное функционирование теплоэнергетических систем, электролабораторные испытания и профессиональное обслуживание технологического оборудования на объектах любого масштаба.\n\nМноголетний опыт работы позволяет нашей команде оперативно решать задачи высокой сложности, гарантируя строгое соответствие государственным стандартам и нормативам РФ.", "imageAlt": "Инженерные системы современного производственного предприятия"}$about$::jsonb, '/images/about/hero.png', 'hero.png') ON CONFLICT (id) DO NOTHING;
UPDATE public.site_header
SET menu_items = (SELECT jsonb_agg(CASE WHEN item->>'href' IN ('/#about', '#about') THEN jsonb_set(item, '{href}', '"/about"'::jsonb) ELSE item END ORDER BY position) FROM jsonb_array_elements(menu_items) WITH ORDINALITY AS entry(item, position)), revision = revision + 1, updated_at = now()
WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(menu_items) AS item WHERE item->>'href' IN ('/#about', '#about'));
UPDATE public.site_footer
SET columns = (SELECT jsonb_agg(jsonb_set(col, '{items}', (SELECT coalesce(jsonb_agg(CASE WHEN item->>'href' IN ('/#about', '#about') THEN jsonb_set(item, '{href}', '"/about"'::jsonb) ELSE item END ORDER BY item_position), '[]'::jsonb) FROM jsonb_array_elements(col->'items') WITH ORDINALITY AS entry(item, item_position))) ORDER BY col_position) FROM jsonb_array_elements(columns) WITH ORDINALITY AS entry(col, col_position)), revision = revision + 1, updated_at = now()
WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(columns) AS col, jsonb_array_elements(col->'items') AS item WHERE item->>'href' IN ('/#about', '#about'));
NOTIFY pgrst, 'reload schema';
COMMIT;
