BEGIN;
CREATE TABLE IF NOT EXISTS public.site_services_why_us (
 id text PRIMARY KEY CHECK (id = 'main'),
 title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
 cards jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(cards) = 'array' AND jsonb_array_length(cards) <= 12),
 revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_services_why_us ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_services_why_us FROM anon, authenticated;
GRANT SELECT ON public.site_services_why_us TO anon, authenticated;
GRANT ALL ON public.site_services_why_us TO service_role;
CREATE POLICY "Services why us is public" ON public.site_services_why_us FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_services_why_us (id,title,cards) VALUES ('main','Почему выбирают нас',
'[{"id": "experience", "title": "12+", "caption": "лет опыта", "description": "Успешно проектируем и сдаем КСОБ государственным органам и коммерческим компаниям."}, {"id": "licenses", "title": "МЧС", "caption": "Все лицензии", "description": "Обладаем лицензией МЧС, допусками СРО и всеми необходимыми сертификатами соответствия."}, {"id": "deadlines", "title": "100%", "caption": "Сроки по договору", "description": "Четко прописываем финальный дедлайн и несем строгую материальную ответственность за его срыв."}, {"id": "warranty", "title": "3 года", "caption": "Гарантия на работы", "description": "Предоставляем расширенное гарантийное и постгарантийное обслуживание установленного оборудования."}]'::jsonb)
ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
