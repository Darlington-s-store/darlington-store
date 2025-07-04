
-- Create testimonials table to store customer testimonials
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_location TEXT NOT NULL,
  product_purchased TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create brands table to manage brands
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view approved testimonials
CREATE POLICY "Anyone can view approved testimonials" 
  ON public.testimonials 
  FOR SELECT 
  USING (is_approved = true AND is_active = true);

-- Allow admins to manage testimonials
CREATE POLICY "Admins can manage testimonials" 
  ON public.testimonials 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policies for brands
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active brands
CREATE POLICY "Anyone can view active brands" 
  ON public.brands 
  FOR SELECT 
  USING (is_active = true);

-- Allow admins to manage brands
CREATE POLICY "Admins can manage brands" 
  ON public.brands 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert some sample brands
INSERT INTO public.brands (name, logo_url, description, is_featured, display_order) VALUES
('Apple', 'https://images.unsplash.com/photo-1621768216002-5ac171876625?auto=format&fit=crop&w=120&q=80', 'Leading technology company known for iPhone, iPad, MacBook, and more', true, 1),
('Samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=120&q=80', 'Global electronics leader with Galaxy smartphones, tablets, and home appliances', true, 2),
('Sony', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=120&q=80', 'Entertainment and electronics giant with PlayStation, cameras, and audio equipment', true, 3),
('Microsoft', 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=120&q=80', 'Technology company behind Xbox, Surface devices, and Windows', true, 4),
('HP', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=120&q=80', 'Leading computer and printer manufacturer', false, 5),
('Dell', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=120&q=80', 'Computer technology company specializing in laptops and desktops', false, 6);

-- Add triggers for updating timestamps
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
