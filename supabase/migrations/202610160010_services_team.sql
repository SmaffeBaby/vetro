BEGIN;
CREATE TABLE IF NOT EXISTS public.site_services_team (
 id text PRIMARY KEY CHECK (id = 'main'),
 title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
 description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 4000),
 cards jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(cards) = 'array' AND jsonb_array_length(cards) <= 24),
 media_cleanup_paths jsonb NOT NULL DEFAULT '[]'::jsonb,
 revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_services_team ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_services_team FROM anon, authenticated;
GRANT SELECT ON public.site_services_team TO anon, authenticated;
GRANT ALL ON public.site_services_team TO service_role;
CREATE POLICY "Services team is public" ON public.site_services_team FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_services_team (id,title,description,cards) VALUES ('main','Команда инженеров','Мы объединили опытных специалистов по монтажу, сервису и инженерным решениям для вашего объекта.','[{"id": "maria", "sortOrder": 10, "name": "Мария Орлова", "position": "Руководитель монтажа", "description": "Контролирует сроки и качество работ на объекте, обеспечивает безопасность процесса.", "imagePath": "Services/DetailServices/Team/maria.png", "imageFilename": "maria.png"}, {"id": "ivan", "sortOrder": 20, "name": "Иван Смирнов", "position": "Ведущий инженер", "description": "Руководит компанией и курирует ключевые проекты по безопасности и автоматизации.", "imagePath": "Services/DetailServices/Team/ivan.png", "imageFilename": "ivan.png"}, {"id": "dmitry", "sortOrder": 30, "name": "Дмитрий Кузнецов", "position": "Ведущий инженер", "description": "Разрабатывает схемы подключения и подбирает оборудование для сложных систем.", "imagePath": "Services/DetailServices/Team/dmitry.png", "imageFilename": "dmitry.png"}, {"id": "elena", "sortOrder": 40, "name": "Елена Соколова", "position": "Менеджер сервиса", "description": "Организует обслуживание и гарантийные ремонты, поддерживает связь с клиентами.", "imagePath": "Services/DetailServices/Team/elena.png", "imageFilename": "elena.png"}, {"id": "demo-1", "sortOrder": 50, "name": "Мария Орлова", "position": "Руководитель монтажа", "description": "Контролирует сроки и качество работ на объекте, обеспечивает безопасность процесса.", "imagePath": "Services/DetailServices/Team/maria.png", "imageFilename": "maria.png"}, {"id": "demo-2", "sortOrder": 60, "name": "Иван Смирнов", "position": "Ведущий инженер", "description": "Руководит компанией и курирует ключевые проекты по безопасности и автоматизации.", "imagePath": "Services/DetailServices/Team/ivan.png", "imageFilename": "ivan.png"}]'::jsonb) ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
