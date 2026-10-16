BEGIN;
UPDATE public.site_services_why_us
SET title = 'Почему нас выбирают', cards = '[{"id": "benefit-1", "description": "Оптимальная стоимость услуг — предлагаем конкурентные условия при сохранении высокого качества обслуживания"}, {"id": "benefit-2", "description": "Квалифицированные специалисты — в команде специалисты различных технических направлений, что позволяет решать широкий спектр задач."}, {"id": "benefit-3", "description": "Комплексный подход — оказываем услуги по нескольким направлениям, позволяя заказчику работать с одним подрядчиком."}, {"id": "benefit-4", "description": "Постоянная коммуникация с заказчиком — оперативно взаимодействуем на всех этапах выполнения работ и учитываем индивидуальные потребности."}, {"id": "benefit-5", "description": "Индивидуальный подход — подбираем оптимальные решения под конкретные задачи заказчика, как в части технических работ, так и в вопросах документации."}, {"id": "benefit-6", "description": "Гибкость в решении задач — учитываем особенности объекта, требования заказчика и предлагаем наиболее подходящий вариант выполнения работ"}]'::jsonb, revision = revision + 1, updated_at = now()
WHERE id = 'main' AND title = 'Почему выбирают нас' AND cards = '[{"id": "experience", "title": "12+", "caption": "лет опыта", "description": "Успешно проектируем и сдаем КСОБ государственным органам и коммерческим компаниям."}, {"id": "licenses", "title": "МЧС", "caption": "Все лицензии", "description": "Обладаем лицензией МЧС, допусками СРО и всеми необходимыми сертификатами соответствия."}, {"id": "deadlines", "title": "100%", "caption": "Сроки по договору", "description": "Четко прописываем финальный дедлайн и несем строгую материальную ответственность за его срыв."}, {"id": "warranty", "title": "3 года", "caption": "Гарантия на работы", "description": "Предоставляем расширенное гарантийное и постгарантийное обслуживание установленного оборудования."}]'::jsonb;

-- Keep edited content when converting the old three-field cards to a single text field.
UPDATE public.site_services_why_us AS settings
SET cards = (SELECT coalesce(jsonb_agg(jsonb_build_object('id', card->>'id', 'description', concat_ws(E'\n', nullif(card->>'title',''), nullif(card->>'caption',''), nullif(card->>'description',''))) ORDER BY ordinal), '[]'::jsonb)
 FROM jsonb_array_elements(settings.cards) WITH ORDINALITY AS item(card, ordinal)),
 revision = revision + 1, updated_at = now()
WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(settings.cards) AS card WHERE card ? 'title' OR card ? 'caption');
NOTIFY pgrst, 'reload schema';
COMMIT;
