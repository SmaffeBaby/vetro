BEGIN;
CREATE TABLE public.site_object_results (
 object_id text PRIMARY KEY REFERENCES public.site_objects(id) ON DELETE CASCADE,
 title text NOT NULL DEFAULT 'Результаты' CHECK(char_length(title) BETWEEN 1 AND 240),
 cards jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(cards)='array' AND jsonb_array_length(cards)<=16),
 revision bigint NOT NULL DEFAULT 1 CHECK(revision>0),updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_object_results ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_object_results FROM anon,authenticated;
GRANT SELECT ON public.site_object_results TO anon,authenticated;
GRANT ALL ON public.site_object_results TO service_role;
CREATE POLICY "Published object results are public" ON public.site_object_results FOR SELECT TO anon,authenticated USING(EXISTS(SELECT 1 FROM public.site_objects o WHERE o.id=object_id AND o.published));
INSERT INTO public.site_object_results(object_id,title,cards)
SELECT id,'Результаты','[{"id": "stops", "value": "0", "text": "аварийных остановок за 2023 год"}, {"id": "readiness", "value": "100%", "text": "готовность к отопительному сезону"}, {"id": "monitoring", "value": "24/7", "text": "мониторинг всех систем"}, {"id": "response", "value": "< 2 ч", "text": "среднее время реагирования"}]'::jsonb FROM public.site_objects WHERE id='botkin' ON CONFLICT(object_id) DO NOTHING;
NOTIFY pgrst,'reload schema';
COMMIT;
