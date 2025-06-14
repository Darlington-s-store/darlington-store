
-- Update products with their actual product images

-- Update Logitech MX Master 3 mouse
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%MX Master%' OR name ILIKE '%Logitech%mouse%';

-- Update Anker PowerCore power banks
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1609592385810-b5d8b2e145d7?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1609592385810-b5d8b2e145d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1619040843233-dd079d798c4d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%PowerCore%' OR name ILIKE '%Anker%' AND name ILIKE '%power%';

-- Update Apple USB-C to Lightning cables
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%USB-C%Lightning%' OR (name ILIKE '%Apple%' AND name ILIKE '%cable%');

-- Update Samsung Galaxy Tab tablets
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Galaxy Tab%' OR (name ILIKE '%Samsung%' AND name ILIKE '%tablet%');

-- Update iPhone products with better iPhone images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%iPhone%';

-- Update MacBook products with better laptop images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%MacBook%' OR (name ILIKE '%Apple%' AND name ILIKE '%laptop%');

-- Update AirPods with proper headphone/earbud images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1610438235354-a6ae5528385c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%AirPods%';

-- Update watch products with watch images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%watch%';

-- Update keyboard products with keyboard images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%keyboard%';

-- Update monitor/display products with monitor images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%monitor%' OR name ILIKE '%display%';

-- Update speaker products with speaker images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%speaker%';

-- Update headphone products (not AirPods) with headphone images
UPDATE public.products 
SET 
  image_url = '/lovable-uploads/01f5dee9-0b3f-4b4e-aaa8-dc52b099224b.png',
  images = jsonb_build_array(
    '/lovable-uploads/01f5dee9-0b3f-4b4e-aaa8-dc52b099224b.png',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%headphone%' AND name NOT ILIKE '%AirPods%';

-- Ensure all remaining products have at least the primary image in their images array
UPDATE public.products 
SET images = jsonb_build_array(image_url)
WHERE images IS NULL OR images = '[]'::jsonb OR jsonb_array_length(images) = 0;
