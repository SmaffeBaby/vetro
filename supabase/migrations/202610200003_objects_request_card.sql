BEGIN;
CREATE TABLE public.site_objects_request_card (LIKE public.site_services_help_card INCLUDING ALL);
ALTER TABLE public.site_objects_request_card DROP CONSTRAINT site_services_help_card_image_path_check;
ALTER TABLE public.site_objects_request_card ADD CONSTRAINT objects_request_image_path_check CHECK (image_path ~ '^Objects/RequestCard/[a-zA-Z0-9_-][a-zA-Z0-9_.-]{0,239}$');
ALTER TABLE public.site_objects_request_card ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_objects_request_card FROM anon,authenticated;
GRANT SELECT ON public.site_objects_request_card TO anon,authenticated;
GRANT ALL ON public.site_objects_request_card TO service_role;
CREATE POLICY "Objects request card is public" ON public.site_objects_request_card FOR SELECT TO anon,authenticated USING(true);
INSERT INTO public.site_objects_request_card (id,title,text,button_label,svg,filename)
SELECT 'main','Хотите такой же уровень обслуживания на вашем объекте?','Свяжитесь с нами для проведения аудита систем и составления индивидуального плана обслуживания.','Оставить заявку',logo_svg,'logo.svg' FROM public.site_header WHERE id='main';
NOTIFY pgrst,'reload schema';
COMMIT;
