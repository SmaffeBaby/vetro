BEGIN;
-- Accept both layouts while existing objects are copied and settings are migrated.
ALTER TABLE public.site_hero DROP CONSTRAINT IF EXISTS site_hero_image_path_check;
ALTER TABLE public.site_hero ADD CONSTRAINT site_hero_image_path_check
  CHECK (image_path ~ '^(Home/)?Hero/[a-zA-Z0-9_-][a-zA-Z0-9_.-]{0,239}$');
ALTER TABLE public.site_license DROP CONSTRAINT IF EXISTS site_license_image_path_check;
ALTER TABLE public.site_license ADD CONSTRAINT site_license_image_path_check
  CHECK (image_path ~ '^(Home/)?License/[a-zA-Z0-9_-][a-zA-Z0-9_.-]{0,239}$');
NOTIFY pgrst, 'reload schema';
COMMIT;
