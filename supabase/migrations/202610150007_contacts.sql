BEGIN;
CREATE TABLE IF NOT EXISTS public.site_contacts (
  id text PRIMARY KEY DEFAULT 'main' CHECK (id = 'main'),
  items jsonb NOT NULL CHECK (jsonb_typeof(items) = 'array' AND jsonb_array_length(items) = 3),
  media_cleanup_paths jsonb NOT NULL DEFAULT '[]'::jsonb,
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_contacts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_contacts FROM anon, authenticated;
GRANT SELECT ON public.site_contacts TO anon, authenticated;
GRANT ALL ON public.site_contacts TO service_role;
DROP POLICY IF EXISTS "Contacts are public" ON public.site_contacts;
CREATE POLICY "Contacts are public" ON public.site_contacts FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_contacts (id, items) VALUES ('main', '[{"id":"phone","title":"Телефон","text":"+7 (911) 720 05 10","href":"tel:+79117200510","mode":"link","code":"","highlight":"","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" color=\"#2a9ccf\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233a14 14 0 0 0 6.392 6.384\"/></svg>","iconFilename":"phone.svg","iconPath":null},{"id":"address","title":"Адрес","text":"г. Санкт-Петербург, ул. Шпалерная, д. 54/2","href":"https://yandex.ru/maps/2/saint-petersburg/house/shpalernaya_ulitsa_54_2/Z0kYdQBjQEAEQFtjfXV1eHVhYQ==/","mode":"link","code":"","highlight":"","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" color=\"#2a9ccf\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/></g></svg>","iconFilename":"address.svg","iconPath":null},{"id":"email","title":"Email","text":"help@vetroservice.ru","href":"mailto:help@vetroservice.ru","mode":"link","code":"","highlight":"","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" color=\"#2a9ccf\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7\"/><rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"/></g></svg>","iconFilename":"email.svg","iconPath":null}]'::jsonb) ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
COMMIT;
