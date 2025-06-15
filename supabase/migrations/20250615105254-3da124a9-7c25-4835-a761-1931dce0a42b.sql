
-- Create app_settings table to store site-wide configurations
CREATE TABLE public.app_settings (
  id INT PRIMARY KEY DEFAULT 1,
  site_name TEXT NOT NULL DEFAULT 'Darlington Store',
  site_description TEXT NOT NULL DEFAULT 'Ghana''s Premier Electronics Store',
  contact_email TEXT NOT NULL DEFAULT 'info@darlingtonstore.com',
  support_email TEXT NOT NULL DEFAULT 'support@darlingtonstore.com',
  phone TEXT NOT NULL DEFAULT '+233 24 123 4567',
  address TEXT NOT NULL DEFAULT '123 Oxford Street, Osu, Accra, Ghana',
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  sms_notifications BOOLEAN NOT NULL DEFAULT false,
  order_updates BOOLEAN NOT NULL DEFAULT true,
  promotional_emails BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  allow_guest_checkout BOOLEAN NOT NULL DEFAULT true,
  require_email_verification BOOLEAN NOT NULL DEFAULT true,
  auto_approve_reviews BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton_check CHECK (id = 1)
);

-- Insert the single row for settings if it doesn't exist
INSERT INTO public.app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Enable Row-Level Security on the table
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow admins to read settings
CREATE POLICY "Admins can read settings"
ON public.app_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policy: Allow admins to update settings
CREATE POLICY "Admins can update settings"
ON public.app_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create a function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to execute the function upon update
CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();
