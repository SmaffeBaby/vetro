BEGIN;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('Media', 'Media', true, 5000000, ARRAY['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'])
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;
-- Writes go through authenticated admin API routes using the service role.
ALTER TABLE public.site_header ADD COLUMN IF NOT EXISTS logo_path text;
ALTER TABLE public.site_header ADD COLUMN IF NOT EXISTS logo_filename text NOT NULL DEFAULT 'logo.svg';
-- Keep failed deletions for a retry, including across server restarts.
ALTER TABLE public.site_header ADD COLUMN IF NOT EXISTS media_cleanup_paths jsonb NOT NULL DEFAULT '[]'::jsonb;
NOTIFY pgrst, 'reload schema';
COMMIT;
