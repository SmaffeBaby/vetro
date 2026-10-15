BEGIN;
CREATE TABLE IF NOT EXISTS public.site_about_card (
  id text PRIMARY KEY DEFAULT 'main' CHECK (id = 'main'),
  left_items jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(left_items) = 'array' AND jsonb_array_length(left_items) <= 12),
  center_text text NOT NULL CHECK (char_length(center_text) BETWEEN 1 AND 2000),
  right_items jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(right_items) = 'array' AND jsonb_array_length(right_items) <= 12),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_about_card ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_about_card FROM anon, authenticated;
GRANT SELECT ON public.site_about_card TO anon, authenticated;
GRANT ALL ON public.site_about_card TO service_role;
DROP POLICY IF EXISTS "AboutCard is public" ON public.site_about_card;
CREATE POLICY "AboutCard is public" ON public.site_about_card FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_about_card (id, left_items, center_text, right_items)
VALUES (
  'main',
  '[{"id":"objects","title":"100+","text":"объектов под защитой"},{"id":"experience","title":"15","text":"лет на рынке"}]'::jsonb,
  'Сегодня мы по праву являемся одним из лидеров рынка систем пожарной безопасности в Российской Федерации',
  '[{"id":"solutions","text":"Мы предоставляем комплексные инженерные решения для коммерческих и промышленных объектов, сочетая технические знания с надёжным обслуживанием."},{"id":"trust","text":"Наши клиенты доверяют нам обслуживание критической инфраструктуры, зная, что качество и безопасность — наши главные приоритеты."}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
