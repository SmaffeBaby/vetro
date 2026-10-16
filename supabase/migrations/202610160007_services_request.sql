BEGIN;
CREATE TABLE IF NOT EXISTS public.site_services_request (
 service_id text PRIMARY KEY CHECK (service_id ~ '^[a-zA-Z0-9_-]{1,80}$'),
 title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
 description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 4000),
 note text NOT NULL DEFAULT '' CHECK (char_length(note) <= 2000),
 button_label text NOT NULL CHECK (char_length(button_label) BETWEEN 1 AND 80),
 svg text NOT NULL DEFAULT '',
 image_path text CHECK (image_path ~ '^Services/DetailServices/RequestCard/[a-zA-Z0-9_-][a-zA-Z0-9_.-]{0,239}$'),
 filename text NOT NULL DEFAULT 'logo.svg',
 media_cleanup_paths jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(media_cleanup_paths) = 'array'),
 revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_services_request ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_services_request FROM anon, authenticated;
GRANT SELECT ON public.site_services_request TO anon, authenticated;
GRANT ALL ON public.site_services_request TO service_role;
CREATE POLICY "Service request is public" ON public.site_services_request FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_services_request (service_id, title, description, note, button_label, svg)
SELECT card->>'id', 'Оставьте заявку — мы свяжемся с вами в течение часа', 'Наши ведущие инженеры готовы проанализировать особенности вашего объекта, дать рекомендации по безопасности и составить предварительный расчёт стоимости.', 'Для экстренных случаев доступна круглосуточная горячая линия:
+7 (812) 000-00-00.', 'Оставить заявку', h.logo_svg
FROM public.site_services s CROSS JOIN LATERAL jsonb_array_elements(s.cards) AS card CROSS JOIN public.site_header h WHERE s.id = 'main' AND h.id = 'main'
ON CONFLICT (service_id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
