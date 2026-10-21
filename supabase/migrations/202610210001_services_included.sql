BEGIN;
CREATE TABLE IF NOT EXISTS public.site_services_included (
  service_id text PRIMARY KEY CHECK (service_id ~ '^[a-zA-Z0-9_-]{1,80}$'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
  text text NOT NULL DEFAULT '' CHECK (char_length(text) <= 4000),
  button_label text NOT NULL CHECK (char_length(button_label) BETWEEN 1 AND 80),
  items jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(items) = 'array' AND jsonb_array_length(items) <= 100),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_services_included ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_services_included FROM anon, authenticated;
GRANT SELECT ON public.site_services_included TO anon, authenticated;
GRANT ALL ON public.site_services_included TO service_role;
CREATE POLICY "Service contents are public" ON public.site_services_included FOR SELECT TO anon, authenticated USING (true);
NOTIFY pgrst, 'reload schema';
COMMIT;
