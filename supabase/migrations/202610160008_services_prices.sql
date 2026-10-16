BEGIN;
CREATE TABLE IF NOT EXISTS public.site_services_prices (
 service_id text PRIMARY KEY CHECK (service_id ~ '^[a-zA-Z0-9_-]{1,80}$'),
 title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
 description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 4000),
 button_label text NOT NULL CHECK (char_length(button_label) BETWEEN 1 AND 80),
 rows jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(rows) = 'array' AND jsonb_array_length(rows) <= 50),
 revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_services_prices ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_services_prices FROM anon, authenticated;
GRANT SELECT ON public.site_services_prices TO anon, authenticated;
GRANT ALL ON public.site_services_prices TO service_role;
CREATE POLICY "Service prices are public" ON public.site_services_prices FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_services_prices (service_id,title,description,button_label,rows)
SELECT card->>'id', 'Стоимость услуг', 'Базовые тарифы на основные работы. Точная стоимость рассчитывается индивидуально после обследования объекта.', 'Запросить точный расчёт', CASE WHEN card->>'id' = 'security' THEN '[{"id":"design","name":"Проектирование системы безопасности","price":"от 25 000 ₽"},{"id":"video","name":"Монтаж видеонаблюдения (за камеру)","price":"от 3 500 ₽"},{"id":"access","name":"Установка СКУД (за точку доступа)","price":"от 15 000 ₽"},{"id":"alarm","name":"Монтаж охранной сигнализации","price":"от 45 000 ₽"},{"id":"commissioning","name":"Пусконаладочные работы","price":"от 20 000 ₽"}]'::jsonb ELSE '[]'::jsonb END
FROM public.site_services, jsonb_array_elements(cards) AS card WHERE id = 'main'
ON CONFLICT (service_id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
