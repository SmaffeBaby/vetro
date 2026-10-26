BEGIN;
ALTER TABLE public.site_services_why_us
 ADD COLUMN IF NOT EXISTS metrics_title text NOT NULL DEFAULT 'Почему выбирают нас' CHECK (char_length(metrics_title) BETWEEN 1 AND 240),
 ADD COLUMN IF NOT EXISTS metrics jsonb NOT NULL DEFAULT '[{"id": "experience", "title": "12+", "caption": "Лет опыта", "description": "Успешно проектируем и сдаем КСОБ государственным органам и коммерческим компаниям."}, {"id": "licenses", "title": "МЧС", "caption": "Все лицензии", "description": "Обладаем лицензией МЧС, допусками СРО и всеми необходимыми сертификатами соответствия."}, {"id": "deadlines", "title": "100%", "caption": "Сроки по договору", "description": "Четко прописываем финальный дедлайн и несем строгую материальную ответственность за его срыв."}, {"id": "warranty", "title": "3 года", "caption": "Гарантия на работы", "description": "Предоставляем расширенное гарантийное и постгарантийное обслуживание установленного оборудования."}]'::jsonb CHECK (jsonb_typeof(metrics) = 'array' AND jsonb_array_length(metrics) <= 12);
NOTIFY pgrst, 'reload schema';
COMMIT;
