
-- Update Apple iPad Air 5 product with the new uploaded image
UPDATE public.products 
SET 
  image_url = '/lovable-uploads/7191890f-99d1-4b4c-9662-dbad1c7a405d.png',
  images = '["/lovable-uploads/7191890f-99d1-4b4c-9662-dbad1c7a405d.png"]'::jsonb,
  updated_at = now()
WHERE name ILIKE '%iPad Air 5%' OR name ILIKE '%iPad Air%';
