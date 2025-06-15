
-- Create a new public bucket for site assets like logos and favicons.
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies to allow public access to the new bucket
CREATE POLICY "Public read access for site-assets"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'site-assets' );

CREATE POLICY "Admins can upload to site-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin') );

CREATE POLICY "Admins can update site-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin') );

CREATE POLICY "Admins can delete from site-assets"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin') );

-- Add columns to app_settings for logo and favicon URLs
ALTER TABLE public.app_settings
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS favicon_url TEXT;
