
-- Fix missing product images by replacing broken upload links with working placeholder images

-- Update Anker PowerCore 10000 with working images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1609592385810-b5d8b2e145d7?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1609592385810-b5d8b2e145d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1619040843233-dd079d798c4d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%PowerCore 10000%' OR (name ILIKE '%Anker%' AND name ILIKE '%10000%');

-- Update iPad Air 5 with working images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%iPad Air 5%' OR name ILIKE '%iPad Air%';

-- Update any products that still have broken lovable-uploads links
UPDATE public.products 
SET 
  image_url = CASE 
    WHEN name ILIKE '%iPhone%' THEN 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
    WHEN name ILIKE '%iPad%' THEN 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'
    WHEN name ILIKE '%MacBook%' OR name ILIKE '%laptop%' THEN 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    WHEN name ILIKE '%AirPods%' OR name ILIKE '%headphone%' THEN 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80'
    WHEN name ILIKE '%watch%' THEN 'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=800&q=80'
    WHEN name ILIKE '%mouse%' THEN 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
    WHEN name ILIKE '%keyboard%' THEN 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80'
    WHEN name ILIKE '%monitor%' OR name ILIKE '%display%' THEN 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    WHEN name ILIKE '%speaker%' THEN 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'
    WHEN name ILIKE '%power%' OR name ILIKE '%charger%' THEN 'https://images.unsplash.com/photo-1609592385810-b5d8b2e145d7?auto=format&fit=crop&w=800&q=80'
    ELSE 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  END,
  images = CASE 
    WHEN name ILIKE '%iPhone%' THEN jsonb_build_array(
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80'
    )
    WHEN name ILIKE '%iPad%' THEN jsonb_build_array(
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80'
    )
    WHEN name ILIKE '%MacBook%' OR name ILIKE '%laptop%' THEN jsonb_build_array(
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
    )
    ELSE jsonb_build_array(
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    )
  END,
  updated_at = now()
WHERE image_url LIKE '/lovable-uploads/%' OR images::text LIKE '%/lovable-uploads/%';
