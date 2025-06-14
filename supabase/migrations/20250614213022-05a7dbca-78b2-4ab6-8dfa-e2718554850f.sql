
-- Update existing products to ensure they have proper image arrays
UPDATE public.products 
SET images = CASE 
  WHEN images IS NULL OR images = '[]'::jsonb THEN 
    CASE 
      WHEN image_url IS NOT NULL THEN jsonb_build_array(image_url)
      ELSE '[]'::jsonb
    END
  ELSE images
END
WHERE images IS NULL OR images = '[]'::jsonb;

-- Add some sample multiple images for demonstration
UPDATE public.products 
SET images = jsonb_build_array(
  image_url,
  'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80'
)
WHERE name ILIKE '%iPhone%' AND jsonb_array_length(images) <= 1;

UPDATE public.products 
SET images = jsonb_build_array(
  image_url,
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80'
)
WHERE name ILIKE '%iPad%' AND jsonb_array_length(images) <= 1;

UPDATE public.products 
SET images = jsonb_build_array(
  image_url,
  'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=800&q=80'
)
WHERE name ILIKE '%laptop%' AND jsonb_array_length(images) <= 1;

UPDATE public.products 
SET images = jsonb_build_array(
  image_url,
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
)
WHERE category_id = 3 AND name NOT ILIKE '%iPhone%' AND name NOT ILIKE '%iPad%' AND name NOT ILIKE '%laptop%' AND jsonb_array_length(images) <= 1;
