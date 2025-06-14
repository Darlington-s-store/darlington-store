
-- Update all products with proper online images

-- Update iPhone 15 Pro with proper iPhone images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1695048071623-14d1c5750cdc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1701194263060-9cb0f6d68e90?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%iPhone 15%';

-- Update MacBook Air M2 with proper MacBook images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%MacBook Air%';

-- Update MacBook Pro with proper MacBook Pro images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515343480029-43cdfe808c21?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%MacBook Pro%';

-- Update AirPods with proper AirPods images
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

-- Update Samsung Galaxy S24 with proper Samsung phone images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1610792516307-bef36c8bd3e5?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1610792516307-bef36c8bd3e5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571867424488-4565932edb41?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Galaxy S24%' OR name ILIKE '%Samsung Galaxy S24%';

-- Update Dell XPS laptops with proper laptop images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515343480029-43cdfe808c21?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Dell XPS%';

-- Update Lenovo ThinkPad with proper laptop images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1515343480029-43cdfe808c21?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1515343480029-43cdfe808c21?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%ThinkPad%';

-- Update HP laptop with proper laptop images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515343480029-43cdfe808c21?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%HP%' AND name ILIKE '%laptop%';

-- Update JBL speakers with proper speaker images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%JBL%' AND name ILIKE '%speaker%';

-- Update Bose speakers/headphones
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Bose%';

-- Update Sony headphones/earbuds
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Sony%' AND (name ILIKE '%headphone%' OR name ILIKE '%earbud%');

-- Update LG monitors/displays
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%LG%' AND (name ILIKE '%monitor%' OR name ILIKE '%display%');

-- Update Samsung monitors/displays
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Samsung%' AND (name ILIKE '%monitor%' OR name ILIKE '%display%');

-- Update Apple Watch with proper watch images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Apple Watch%';

-- Update Samsung Galaxy Watch with proper watch images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Galaxy Watch%';

-- Update Logitech mouse with proper mouse images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Logitech%' AND name ILIKE '%mouse%';

-- Update Logitech keyboards with proper keyboard images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Logitech%' AND name ILIKE '%keyboard%';

-- Update Razer gaming products
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Razer%';

-- Update Nintendo Switch with proper gaming console images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1591387743944-6a2e3c3d9ec9?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Nintendo Switch%';

-- Update PlayStation with proper gaming console images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%PlayStation%' OR name ILIKE '%PS5%';

-- Update Xbox with proper gaming console images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Xbox%';

-- Update Canon cameras with proper camera images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Canon%' AND name ILIKE '%camera%';

-- Update Nikon cameras with proper camera images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Nikon%' AND name ILIKE '%camera%';

-- Update GoPro cameras with proper action camera images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%GoPro%';

-- Update DJI drones with proper drone images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520637836862-4d197d17c7a4?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%DJI%' OR name ILIKE '%drone%';

-- Update Fitbit with proper fitness tracker images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Fitbit%';

-- Update Kindle e-readers with proper e-reader images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Kindle%';

-- Update Microsoft Surface with proper Surface device images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Surface%';

-- Update ASUS products with proper laptop/tech images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515343480029-43cdfe808c21?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%ASUS%';

-- Update Acer products with proper laptop/tech images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515343480029-43cdfe808c21?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Acer%';

-- Update SanDisk storage devices with proper USB/storage images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1609592385810-b5d8b2e145d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1619040843233-dd079d798c4d?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%SanDisk%';

-- Update Western Digital storage with proper storage device images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1619040843233-dd079d798c4d?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1619040843233-dd079d798c4d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1609592385810-b5d8b2e145d7?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Western Digital%' OR name ILIKE '%WD%';

-- Update Seagate storage with proper storage device images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1609592385810-b5d8b2e145d7?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1609592385810-b5d8b2e145d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1619040843233-dd079d798c4d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Seagate%';

-- Update Apple cables with proper cable images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%Apple%' AND name ILIKE '%cable%';

-- Update Generic cables with proper cable images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%cable%' AND name NOT ILIKE '%Apple%';

-- Update phone cases with proper case images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1559124611-bda0dd502c4e?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1559124611-bda0dd502c4e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584002680896-b6d5abea6fb6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585060544331-4e90bb7d6c47?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%case%' AND (name ILIKE '%phone%' OR name ILIKE '%iPhone%' OR name ILIKE '%Samsung%');

-- Update chargers with proper charger images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1609592385810-b5d8b2e145d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%charger%';

-- Update screen protectors with proper accessory images
UPDATE public.products 
SET 
  image_url = 'https://images.unsplash.com/photo-1584002680896-b6d5abea6fb6?auto=format&fit=crop&w=800&q=80',
  images = jsonb_build_array(
    'https://images.unsplash.com/photo-1584002680896-b6d5abea6fb6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559124611-bda0dd502c4e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585060544331-4e90bb7d6c47?auto=format&fit=crop&w=800&q=80'
  ),
  updated_at = now()
WHERE name ILIKE '%screen protector%';

-- Ensure all remaining products have proper primary images and multi-image arrays
UPDATE public.products 
SET images = jsonb_build_array(image_url)
WHERE images IS NULL OR images = '[]'::jsonb OR jsonb_array_length(images) = 0;
