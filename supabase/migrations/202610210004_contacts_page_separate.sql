BEGIN;
CREATE TABLE IF NOT EXISTS public.site_contacts_page (LIKE public.site_contacts INCLUDING ALL);
ALTER TABLE public.site_contacts_page ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_contacts_page FROM anon, authenticated;
GRANT SELECT ON public.site_contacts_page TO anon, authenticated;
GRANT ALL ON public.site_contacts_page TO service_role;
CREATE POLICY "Contacts page is public" ON public.site_contacts_page FOR SELECT TO anon, authenticated USING (true);
-- Copy content without media ownership so edits on either page cannot delete the other's SVG files.
INSERT INTO public.site_contacts_page (id, items, page, revision, updated_at, media_cleanup_paths)
SELECT id,
  (SELECT jsonb_agg(item || '{"iconPath":null}'::jsonb ORDER BY position) FROM jsonb_array_elements(items) WITH ORDINALITY AS entry(item, position)),
  CASE WHEN page IS NULL THEN NULL ELSE jsonb_set(page, '{socials}',
    (SELECT jsonb_agg(item || '{"iconPath":null}'::jsonb ORDER BY position) FROM jsonb_array_elements(page->'socials') WITH ORDINALITY AS entry(item, position))) END,
  1, now(), '[]'::jsonb
FROM public.site_contacts WHERE id = 'main'
ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
