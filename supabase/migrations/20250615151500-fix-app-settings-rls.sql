
-- Drop the existing restrictive read policy
DROP POLICY IF EXISTS "Admins can read settings" ON public.app_settings;

-- Create a new policy to allow public read access to settings
CREATE POLICY "Public can read settings"
ON public.app_settings
FOR SELECT
TO public
USING (true);
