BEGIN;
ALTER TABLE public.site_contacts ADD COLUMN IF NOT EXISTS page jsonb CHECK (page IS NULL OR jsonb_typeof(page) = 'object');
UPDATE public.site_header
SET menu_items = (SELECT jsonb_agg(CASE WHEN item->>'href' IN ('/#contacts', '#contacts') THEN jsonb_set(item, '{href}', '"/contacts"'::jsonb) ELSE item END ORDER BY position) FROM jsonb_array_elements(menu_items) WITH ORDINALITY AS entry(item, position)), revision = revision + 1, updated_at = now()
WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(menu_items) AS item WHERE item->>'href' IN ('/#contacts', '#contacts'));
UPDATE public.site_footer
SET columns = (SELECT jsonb_agg(jsonb_set(col, '{items}', (SELECT coalesce(jsonb_agg(CASE WHEN item->>'href' IN ('/#contacts', '#contacts') THEN jsonb_set(item, '{href}', '"/contacts"'::jsonb) ELSE item END ORDER BY item_position), '[]'::jsonb) FROM jsonb_array_elements(col->'items') WITH ORDINALITY AS entry(item, item_position))) ORDER BY col_position) FROM jsonb_array_elements(columns) WITH ORDINALITY AS entry(col, col_position)), revision = revision + 1, updated_at = now()
WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(columns) AS col, jsonb_array_elements(col->'items') AS item WHERE item->>'href' IN ('/#contacts', '#contacts'));
NOTIFY pgrst, 'reload schema';
COMMIT;
