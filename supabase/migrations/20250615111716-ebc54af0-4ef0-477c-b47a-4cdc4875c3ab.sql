
-- Alter orders table to include delivery fee and method
ALTER TABLE public.orders
ADD COLUMN delivery_fee NUMERIC DEFAULT 0,
ADD COLUMN delivery_method TEXT DEFAULT 'Standard Delivery';

-- Create delivery_locations table to store fees and estimates per city
CREATE TABLE public.delivery_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  city TEXT UNIQUE NOT NULL,
  fee NUMERIC NOT NULL,
  estimated_days_min INT NOT NULL DEFAULT 2,
  estimated_days_max INT NOT NULL DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security on the new table
ALTER TABLE public.delivery_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all users to read active delivery locations
CREATE POLICY "Allow all users to read active delivery locations"
ON public.delivery_locations
FOR SELECT
USING (is_active = true);

-- RLS Policy: Allow admins to manage delivery locations
CREATE POLICY "Admins can manage delivery locations"
ON public.delivery_locations
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert some sample delivery locations and fees
INSERT INTO public.delivery_locations (region, city, fee, estimated_days_min, estimated_days_max) VALUES
('Greater Accra', 'Accra', 20.00, 1, 3),
('Ashanti', 'Kumasi', 35.00, 2, 5),
('Western', 'Takoradi', 40.00, 3, 6),
('Northern', 'Tamale', 50.00, 4, 7),
('Volta', 'Ho', 45.00, 3, 6);

-- Create a trigger to automatically update the 'updated_at' timestamp
CREATE TRIGGER update_delivery_locations_updated_at
BEFORE UPDATE ON public.delivery_locations
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();
