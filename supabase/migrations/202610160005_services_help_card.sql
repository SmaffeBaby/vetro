BEGIN;
CREATE TABLE IF NOT EXISTS public.site_services_help_card (
  id text PRIMARY KEY DEFAULT 'main' CHECK (id = 'main'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
  text text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 3000),
  button_label text NOT NULL CHECK (char_length(button_label) BETWEEN 1 AND 80),
  svg text NOT NULL DEFAULT '',
  image_path text CHECK (image_path ~ '^Services/HelpCard/[a-zA-Z0-9_-][a-zA-Z0-9_.-]{0,239}$'),
  filename text NOT NULL DEFAULT 'logo.svg',
  media_cleanup_paths jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(media_cleanup_paths) = 'array'),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_services_help_card ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_services_help_card FROM anon, authenticated;
GRANT SELECT ON public.site_services_help_card TO anon, authenticated;
GRANT ALL ON public.site_services_help_card TO service_role;
CREATE POLICY "Services HelpCard is public" ON public.site_services_help_card FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_services_help_card (id, title, text, button_label, svg)
SELECT 'main', 'Не нашли нужную услугу?',
  'Оставьте заявку в любой удобной форме — наши инженеры проанализируют ваш запрос и подготовят индивидуальное решение.',
  'Получить консультацию', logo_svg FROM public.site_header WHERE id = 'main'
ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
