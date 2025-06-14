
-- Update Anker PowerCore 10000 with the new uploaded images
UPDATE public.products 
SET 
  image_url = '/lovable-uploads/53509c0c-6f80-428c-84ea-d1ae203672c3.png',
  images = jsonb_build_array(
    '/lovable-uploads/53509c0c-6f80-428c-84ea-d1ae203672c3.png',
    '/lovable-uploads/2aab8c34-c759-47db-a03d-0618b5543edd.png',
    '/lovable-uploads/004ab9ad-20f4-4a7e-b59f-52975309453d.png'
  ),
  updated_at = now()
WHERE name ILIKE '%PowerCore 10000%' OR (name ILIKE '%Anker%' AND name ILIKE '%10000%');
