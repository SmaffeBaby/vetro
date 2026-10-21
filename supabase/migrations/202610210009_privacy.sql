BEGIN;
CREATE TABLE IF NOT EXISTS public.site_privacy (
  id text PRIMARY KEY CHECK (id = 'main'),
  content jsonb NOT NULL CHECK (jsonb_typeof(content) = 'object'),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_privacy ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_privacy FROM anon, authenticated;
GRANT SELECT ON public.site_privacy TO anon, authenticated;
GRANT ALL ON public.site_privacy TO service_role;
CREATE POLICY "Privacy policy is public" ON public.site_privacy FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_privacy (id, content) VALUES ('main', $privacy${"title":"Политика конфиденциальности","breadcrumb":"Политика конфиденциальности","intro":"","navigationLabel":"Содержание","sections":[{"id":"general","title":"Общие положения","text":"Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта Ветро. Политика применяется к данным, которые пользователь добровольно предоставляет при обращении через сайт."},{"id":"data","title":"Какие данные мы собираем","text":"При обращении через сайт пользователь может предоставить имя, контактный телефон, адрес электронной почты, наименование организации, адрес объекта обслуживания и другие сведения, указанные в сообщении."},{"id":"purposes","title":"Цели обработки данных","text":"Предоставленные данные используются для обработки заявок и обращений, связи с пользователем, подготовки коммерческих предложений и договоров, а также организации обслуживания объектов."},{"id":"storage","title":"Порядок хранения и защиты","text":"Для защиты персональных данных применяются организационные и технические меры, направленные на предотвращение неправомерного доступа, изменения, копирования и распространения данных. Срок хранения определяется целями обработки и применимыми требованиями законодательства."},{"id":"sharing","title":"Передача данных третьим лицам","text":"Передача персональных данных третьим лицам осуществляется при наличии законных оснований, в том числе когда это необходимо для исполнения договора с пользователем."},{"id":"rights","title":"Права пользователя","text":"Пользователь может запросить информацию об обработке своих персональных данных, обратиться за их уточнением, блокированием или удалением, а также отозвать согласие на обработку, направив обращение по указанным ниже контактам."},{"id":"contacts","title":"Контакты для вопросов по обработке данных","text":"По вопросам обработки персональных данных вы можете обратиться:\nТелефон: +7 (911) 720 05 10\nE-mail: help@vetroservice.ru\nАдрес: г. Санкт-Петербург, ул. Шпалерная, д. 54/2."}]}$privacy$::jsonb) ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
