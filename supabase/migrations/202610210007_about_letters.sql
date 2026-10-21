BEGIN;
CREATE TABLE IF NOT EXISTS public.site_about_letters (
  id text PRIMARY KEY CHECK (id = 'main'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
  cards jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(cards) = 'array' AND jsonb_array_length(cards) <= 50),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_about_letters ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_about_letters FROM anon, authenticated;
GRANT SELECT ON public.site_about_letters TO anon, authenticated;
GRANT ALL ON public.site_about_letters TO service_role;
CREATE POLICY "Appreciation letters is public" ON public.site_about_letters FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_about_letters (id, title, cards) VALUES ('main', 'Благодарственные письма', $letters$[{"id":"energy","organization":"ООО «Городская Энергетика»","reference":"Благодарственное письмо № 24/2024","tag":"Монтаж систем","text":"Выражаем искреннюю благодарность за качественный монтаж инженерных систем отопления и водоснабжения в объекте «ЖК Солнечный». Работы выполнены в срок, все оборудование сертифицировано и настроено на удаленный мониторинг.","author":"Анна Михайлова","position":"Директор по эксплуатации"},{"id":"plaza","organization":"АО «Бизнес Плаза»","reference":"Благодарственное письмо № 18/2024","tag":"Сервисное обслуживание","text":"Благодарим за оперативное и качественное выполнение работ по техническому обслуживанию тепловых пунктов и систем вентиляции. Сервисная бригада реагирует моментально на любые вызовы, контроль систем всегда на высочайшем уровне.","author":"Дмитрий Козлов","position":"Начальник службы эксплуатации"},{"id":"school","organization":"ГБОУ Школа №1234","reference":"Благодарственное письмо № 09/2024","tag":"Инженерные системы","text":"Провели комплексные замеры сопротивления изоляции и электролабораторные испытания сетей. Выдали официальное заключение в оговоренные сроки. Небольшие недочеты оперативно исправили на месте, обеспечив безопасность эксплуатации.","author":"Елена Сорокина","position":"Директор школы"},{"id":"plaza-service","organization":"АО «Бизнес Плаза»","reference":"Благодарственное письмо № 18/2024","tag":"Сервисное обслуживание","text":"Благодарим за оперативное и качественное выполнение работ по техническому обслуживанию тепловых пунктов и систем вентиляции. Сервисная бригада реагирует моментально на любые вызовы, контроль систем всегда на высочайшем уровне.","author":"Дмитрий Козлов","position":"Начальник службы эксплуатации"}]$letters$::jsonb)
ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
