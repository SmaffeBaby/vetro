BEGIN;
CREATE TABLE public.site_objects_next_object (LIKE public.site_services_help_card INCLUDING ALL);
ALTER TABLE public.site_objects_next_object DROP CONSTRAINT site_services_help_card_image_path_check;
ALTER TABLE public.site_objects_next_object ADD CONSTRAINT objects_next_image_path_check CHECK (image_path ~ '^Objects/NextObject/[a-zA-Z0-9_-][a-zA-Z0-9_.-]{0,239}$');
ALTER TABLE public.site_objects_next_object ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_objects_next_object FROM anon,authenticated;
GRANT SELECT ON public.site_objects_next_object TO anon,authenticated;
GRANT ALL ON public.site_objects_next_object TO service_role;
CREATE POLICY "Objects next card is public" ON public.site_objects_next_object FOR SELECT TO anon,authenticated USING(true);
INSERT INTO public.site_objects_next_object (id,title,text,button_label,svg,filename)
SELECT 'main','Ваш объект может быть следующим','Свяжитесь с нами для проведения предварительного аудита ваших инженерных систем и составления индивидуального регламента обслуживания.','Оставить заявку',logo_svg,'logo.svg' FROM public.site_header WHERE id='main';
NOTIFY pgrst,'reload schema';
COMMIT;
