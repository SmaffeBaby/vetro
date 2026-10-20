BEGIN;
CREATE TABLE public.site_objects_settings (
 id text PRIMARY KEY CHECK(id='main'),title text NOT NULL CHECK(char_length(title) BETWEEN 1 AND 240),button_label text NOT NULL CHECK(char_length(button_label) BETWEEN 1 AND 80),
 categories jsonb NOT NULL CHECK(jsonb_typeof(categories)='array' AND jsonb_array_length(categories) BETWEEN 1 AND 20),revision bigint NOT NULL DEFAULT 1 CHECK(revision>0),updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.site_objects (
 id text PRIMARY KEY CHECK(id ~ '^[a-zA-Z0-9_-]{1,80}$'),title text NOT NULL CHECK(char_length(title) BETWEEN 1 AND 240),address text NOT NULL CHECK(char_length(address) BETWEEN 1 AND 500),category_id text NOT NULL,
 sort_order integer NOT NULL DEFAULT 10 CHECK(sort_order BETWEEN 0 AND 999999),published boolean NOT NULL DEFAULT false,
 subtitle text NOT NULL DEFAULT '' CHECK(char_length(subtitle)<=1000),description text NOT NULL DEFAULT '' CHECK(char_length(description)<=12000),area text NOT NULL DEFAULT '' CHECK(char_length(area)<=100),since_year integer CHECK(since_year BETWEEN 1900 AND 2100),
 image_path text,image_filename text NOT NULL DEFAULT '',service_ids text[] NOT NULL DEFAULT '{}',media_cleanup_paths jsonb NOT NULL DEFAULT '[]'::jsonb,
 revision bigint NOT NULL DEFAULT 1 CHECK(revision>0),updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX site_objects_catalog_idx ON public.site_objects(published,sort_order,id);
ALTER TABLE public.site_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_objects_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_objects,public.site_objects_settings FROM anon,authenticated;
GRANT SELECT ON public.site_objects,public.site_objects_settings TO anon,authenticated;
GRANT ALL ON public.site_objects,public.site_objects_settings TO service_role;
CREATE POLICY "Published objects are public" ON public.site_objects FOR SELECT TO anon,authenticated USING(published);
CREATE POLICY "Object catalog settings are public" ON public.site_objects_settings FOR SELECT TO anon,authenticated USING(true);
INSERT INTO public.site_objects_settings(id,title,button_label,categories) VALUES ('main','Объекты на обслуживании','Подробнее','[{"id": "medicine", "label": "Медицина"}, {"id": "education", "label": "Образование"}, {"id": "business", "label": "Бизнес-центры"}, {"id": "residential", "label": "Жилые комплексы"}, {"id": "sport", "label": "Спорт"}]'::jsonb);
-- Services are stored in site_services.cards; validate their IDs at the database boundary as well.
CREATE FUNCTION public.validate_object_relations() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
DECLARE categories jsonb; services jsonb;
BEGIN
 SELECT s.categories INTO categories FROM public.site_objects_settings s WHERE id='main' FOR SHARE;
 SELECT cards INTO services FROM public.site_services WHERE id='main' FOR SHARE;
 IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(categories) c WHERE c->>'id'=NEW.category_id)
 OR EXISTS(SELECT 1 FROM unnest(NEW.service_ids) id WHERE NOT EXISTS(SELECT 1 FROM jsonb_array_elements(services) c WHERE c->>'id'=id))
 THEN RAISE EXCEPTION 'Unknown category or service' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER validate_object_relations BEFORE INSERT OR UPDATE OF category_id,service_ids ON public.site_objects FOR EACH ROW EXECUTE FUNCTION public.validate_object_relations();
CREATE FUNCTION public.protect_object_categories() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM public.site_objects o WHERE NOT EXISTS(SELECT 1 FROM jsonb_array_elements(NEW.categories) c WHERE c->>'id'=o.category_id)) THEN RAISE EXCEPTION 'Category is assigned to objects' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER protect_object_categories BEFORE UPDATE OF categories ON public.site_objects_settings FOR EACH ROW EXECUTE FUNCTION public.protect_object_categories();
-- Remove obsolete links if a service is removed from the existing JSON catalog.
CREATE FUNCTION public.sync_object_services() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 UPDATE public.site_objects o SET service_ids=ARRAY(SELECT id FROM unnest(o.service_ids) WITH ORDINALITY x(id,n) WHERE EXISTS(SELECT 1 FROM jsonb_array_elements(NEW.cards) c WHERE c->>'id'=id) ORDER BY n),revision=o.revision+1,updated_at=now()
 WHERE EXISTS(SELECT 1 FROM unnest(o.service_ids) id WHERE NOT EXISTS(SELECT 1 FROM jsonb_array_elements(NEW.cards) c WHERE c->>'id'=id));
 RETURN NEW;
END $$;
CREATE TRIGGER sync_object_services AFTER UPDATE OF cards ON public.site_services FOR EACH ROW EXECUTE FUNCTION public.sync_object_services();
INSERT INTO public.site_objects(id,title,address,category_id,sort_order,published,subtitle,description,area,since_year,image_path,image_filename,service_ids) VALUES ('botkin','Клиническая инфекционная больница им. С.П.Боткина','Пискарёвский просп., 49А1, Санкт-Петербург','medicine',10,true,'Многопрофильный инфекционный стационар','Крупнейший инфекционный стационар России, требующий непрерывного и высоконадежного функционирования всех инженерных коммуникаций. Наша команда обеспечивает круглосуточный контроль, мониторинг и регулярное обслуживание ключевых систем жизнеобеспечения учреждения.

Особое внимание уделяется строгому соблюдению санитарно-эпидемиологических норм, бесперебойной подаче тепла и электроэнергии, а также работоспособности комплексных систем безопасности.','42 000 м²',2018,'Objects/Photos/botkin.png','botkin.png',ARRAY(SELECT c->>'id' FROM public.site_services,jsonb_array_elements(cards) c WHERE id='main' AND c->>'id'=ANY(ARRAY['security','heat','electricity','fire']::text[])));
INSERT INTO public.site_objects(id,title,address,category_id,sort_order,published,subtitle,description,area,since_year,image_path,image_filename,service_ids) VALUES ('george','Городская больница Святого Великомученика Георгия','Северный просп., 1, Санкт-Петербург, подъезд 1','medicine',20,true,'','Объект на обслуживании компании «Ветро».','',NULL,'Objects/Photos/george.png','george.png',ARRAY(SELECT c->>'id' FROM public.site_services,jsonb_array_elements(cards) c WHERE id='main' AND c->>'id'=ANY(ARRAY[]::text[])));
INSERT INTO public.site_objects(id,title,address,category_id,sort_order,published,subtitle,description,area,since_year,image_path,image_filename,service_ids) VALUES ('elizabeth','Городская больница Святой преподобномученицы Елизаветы','ул. Вавиловых, 14, Санкт-Петербург','medicine',30,true,'','Объект на обслуживании компании «Ветро».','',NULL,'Objects/Photos/elizabeth.png','elizabeth.png',ARRAY(SELECT c->>'id' FROM public.site_services,jsonb_array_elements(cards) c WHERE id='main' AND c->>'id'=ANY(ARRAY[]::text[])));
INSERT INTO public.site_objects(id,title,address,category_id,sort_order,published,subtitle,description,area,since_year,image_path,image_filename,service_ids) VALUES ('skvortsov','Городская психиатрическая больница № 3 имени И. И. Скворцова-Степанова','Фермское ш., 36АВ, Санкт-Петербург','medicine',40,true,'','Объект на обслуживании компании «Ветро».','',NULL,'Objects/Photos/skvortsov.png','skvortsov.png',ARRAY(SELECT c->>'id' FROM public.site_services,jsonb_array_elements(cards) c WHERE id='main' AND c->>'id'=ANY(ARRAY[]::text[])));
INSERT INTO public.site_objects(id,title,address,category_id,sort_order,published,subtitle,description,area,since_year,image_path,image_filename,service_ids) VALUES ('dzhanelidze','Санкт-Петербургский научно-исследовательский институт скорой помощи имени И.И. Джанелидзе','Будапештская ул., 3, Санкт-Петербург','medicine',50,true,'','Объект на обслуживании компании «Ветро».','',NULL,'Objects/Photos/dzhanelidze.png','dzhanelidze.png',ARRAY(SELECT c->>'id' FROM public.site_services,jsonb_array_elements(cards) c WHERE id='main' AND c->>'id'=ANY(ARRAY[]::text[])));
INSERT INTO public.site_objects(id,title,address,category_id,sort_order,published,subtitle,description,area,since_year,image_path,image_filename,service_ids) VALUES ('dynamo','Академия ледовых видов спорта Динамо Санкт-Петербург','пер. Каховского, 2В, Санкт-Петербург','sport',60,true,'','Объект на обслуживании компании «Ветро».','',NULL,'Objects/Photos/dynamo.png','dynamo.png',ARRAY(SELECT c->>'id' FROM public.site_services,jsonb_array_elements(cards) c WHERE id='main' AND c->>'id'=ANY(ARRAY[]::text[])));
INSERT INTO public.site_objects(id,title,address,category_id,sort_order,published,subtitle,description,area,since_year,image_path,image_filename,service_ids) VALUES ('olympic','СПб ГБПОУ «Олимпийские надежды»','ул. Савушкина, 128, корп. 1, Санкт-Петербург','education',70,true,'','Объект на обслуживании компании «Ветро».','',NULL,'Objects/Photos/olympic.png','olympic.png',ARRAY(SELECT c->>'id' FROM public.site_services,jsonb_array_elements(cards) c WHERE id='main' AND c->>'id'=ANY(ARRAY[]::text[])));
UPDATE public.site_header SET menu_items=replace(menu_items::text,'"/#projects"','"/objects"')::jsonb,revision=revision+1,updated_at=now() WHERE menu_items::text LIKE '%"/#projects"%';
UPDATE public.site_footer SET columns=replace(columns::text,'"/#projects"','"/objects"')::jsonb,revision=revision+1,updated_at=now() WHERE columns::text LIKE '%"/#projects"%';
NOTIFY pgrst,'reload schema';
COMMIT;
