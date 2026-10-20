BEGIN;
CREATE TABLE public.site_object_gallery(
 object_id text PRIMARY KEY REFERENCES public.site_objects(id) ON DELETE CASCADE,
 title text NOT NULL DEFAULT 'Фотографии с объекта' CHECK(char_length(title) BETWEEN 1 AND 240),
 photos jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(photos)='array' AND jsonb_array_length(photos)<=30),
 media_cleanup_paths jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(media_cleanup_paths)='array'),
 revision bigint NOT NULL DEFAULT 1 CHECK(revision>0),updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_object_gallery ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_object_gallery FROM anon,authenticated;
GRANT SELECT ON public.site_object_gallery TO anon,authenticated;
GRANT ALL ON public.site_object_gallery TO service_role;
CREATE POLICY "Published object galleries are public" ON public.site_object_gallery FOR SELECT TO anon,authenticated USING(EXISTS(SELECT 1 FROM public.site_objects o WHERE o.id=object_id AND o.published));
INSERT INTO public.site_object_gallery(object_id) SELECT id FROM public.site_objects WHERE id='botkin' ON CONFLICT(object_id) DO NOTHING;
NOTIFY pgrst,'reload schema';
COMMIT;
