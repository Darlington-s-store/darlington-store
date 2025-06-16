
-- Fix app_settings RLS policies to allow public read and admin write access
DROP POLICY IF EXISTS "Public can read settings" ON public.app_settings;
DROP POLICY IF EXISTS "Admins can update settings" ON public.app_settings;

-- Allow anyone to read app settings (needed for public access)
CREATE POLICY "Anyone can read app_settings"
ON public.app_settings
FOR SELECT
TO public
USING (true);

-- Allow anyone to insert app settings if none exist (for default creation)
CREATE POLICY "Anyone can insert default app_settings"
ON public.app_settings
FOR INSERT
TO public
WITH CHECK (id = 1);

-- Allow admins to update app settings
CREATE POLICY "Admins can update app_settings"
ON public.app_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR (auth.jwt() ->> 'email') = 'admin@darlingtonstore.com');

-- Ensure the site-assets bucket exists and is properly configured
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Update storage policies for site-assets bucket
DROP POLICY IF EXISTS "Public read access for site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete from site-assets" ON storage.objects;

-- Allow public read access to site-assets
CREATE POLICY "Public read access for site-assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-assets');

-- Allow anyone to upload to site-assets (for now, can be restricted later)
CREATE POLICY "Anyone can upload to site-assets"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'site-assets');

-- Allow anyone to update files in site-assets
CREATE POLICY "Anyone can update site-assets"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'site-assets');

-- Allow anyone to delete from site-assets
CREATE POLICY "Anyone can delete from site-assets"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'site-assets');
