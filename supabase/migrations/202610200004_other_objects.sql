BEGIN;
CREATE TABLE public.site_other_objects (
 id text PRIMARY KEY DEFAULT 'main' CHECK(id='main'),title text NOT NULL CHECK(char_length(title) BETWEEN 1 AND 240),
 button_label text NOT NULL CHECK(char_length(button_label) BETWEEN 1 AND 80),object_ids text[] NOT NULL DEFAULT '{}' CHECK(cardinality(object_ids)<=100),
 revision bigint NOT NULL DEFAULT 1 CHECK(revision>0),updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_other_objects ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_other_objects FROM anon,authenticated;
GRANT SELECT ON public.site_other_objects TO anon,authenticated;
GRANT ALL ON public.site_other_objects TO service_role;
CREATE POLICY "Other objects settings are public" ON public.site_other_objects FOR SELECT TO anon,authenticated USING(true);
INSERT INTO public.site_other_objects(id,title,button_label) VALUES('main','Другие объекты','Все объекты');
NOTIFY pgrst,'reload schema';
COMMIT;
