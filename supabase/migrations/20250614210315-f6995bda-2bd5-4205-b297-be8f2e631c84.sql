
-- Add more diverse electronics products with unique images
INSERT INTO public.products (name, description, price, category_id, image_url, images, stock_quantity, brand, model, specifications) VALUES

-- More Smartphones with unique images
('Infinix Note 12', 'Affordable smartphone with large display and good battery life', 899.00, 2, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 50, 'Infinix', 'Note 12', '{"storage": "128GB", "camera": "48MP", "display": "6.7-inch", "battery": "5000mAh", "ram": "4GB"}'::jsonb),

('Xiaomi Redmi Note 11', 'Budget-friendly smartphone with quad camera setup', 1099.00, 2, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80"]'::jsonb, 40, 'Xiaomi', 'Redmi Note 11', '{"storage": "64GB", "camera": "50MP", "display": "6.43-inch AMOLED", "battery": "5000mAh", "ram": "4GB"}'::jsonb),

('OPPO A57', 'Stylish design with AI portrait camera', 1199.00, 2, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80"]'::jsonb, 30, 'OPPO', 'A57', '{"storage": "128GB", "camera": "13MP", "display": "6.56-inch", "battery": "5000mAh", "ram": "3GB"}'::jsonb),

-- More Laptops with unique images
('Dell Inspiron 15 3000', 'Entry-level laptop perfect for students and basic tasks', 2199.00, 1, 'https://images.unsplash.com/photo-1525373612132-b3e820b87cea?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1525373612132-b3e820b87cea?auto=format&fit=crop&w=800&q=80"]'::jsonb, 25, 'Dell', 'Inspiron 15 3000', '{"processor": "Intel Celeron", "ram": "4GB", "storage": "1TB HDD", "display": "15.6-inch HD", "graphics": "Intel UHD"}'::jsonb),

('ASUS VivoBook 15', 'Lightweight laptop with modern design', 2799.00, 1, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=80"]'::jsonb, 20, 'ASUS', 'VivoBook 15', '{"processor": "Intel Core i3", "ram": "8GB", "storage": "256GB SSD", "display": "15.6-inch Full HD", "graphics": "Intel UHD"}'::jsonb),

-- Audio & Headphones with unique images
('Sony WH-CH720N', 'Noise canceling wireless headphones', 899.00, 5, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"]'::jsonb, 45, 'Sony', 'WH-CH720N', '{"battery": "35 hours", "noise_canceling": "Active", "connectivity": "Bluetooth 5.2", "drivers": "30mm"}'::jsonb),

('Oraimo FreePods 3', 'True wireless earbuds with charging case', 199.00, 5, 'https://images.unsplash.com/photo-1590658165737-15a047b7a6e8?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1590658165737-15a047b7a6e8?auto=format&fit=crop&w=800&q=80"]'::jsonb, 80, 'Oraimo', 'FreePods 3', '{"battery": "6 hours + 18 with case", "connectivity": "Bluetooth 5.0", "charging": "USB-C", "water_resistance": "IPX4"}'::jsonb),

-- Smart Watches & Wearables
('Samsung Galaxy Watch 4', 'Advanced smartwatch with health monitoring', 1599.00, 3, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"]'::jsonb, 25, 'Samsung', 'Galaxy Watch 4', '{"display": "1.4-inch Super AMOLED", "battery": "40 hours", "sensors": "Heart rate, SpO2, GPS", "compatibility": "Android"}'::jsonb),

('Xiaomi Mi Band 7', 'Affordable fitness tracker with long battery life', 299.00, 3, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80"]'::jsonb, 60, 'Xiaomi', 'Mi Band 7', '{"display": "1.62-inch AMOLED", "battery": "14 days", "sensors": "Heart rate, SpO2", "water_resistance": "5ATM"}'::jsonb),

-- Cameras & Photography
('Canon EOS M50 Mark II', 'Mirrorless camera perfect for content creators', 3899.00, 3, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80"]'::jsonb, 12, 'Canon', 'EOS M50 Mark II', '{"sensor": "24.1MP APS-C", "video": "4K", "display": "3-inch touchscreen", "connectivity": "Wi-Fi, Bluetooth"}'::jsonb),

-- Computer Accessories
('Logitech K380 Keyboard', 'Multi-device wireless keyboard', 349.00, 3, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"]'::jsonb, 55, 'Logitech', 'K380', '{"connectivity": "Bluetooth", "battery": "2 years", "compatibility": "Windows, Mac, iOS, Android", "keys": "Round keys"}'::jsonb),

('HP DeskJet 2720', 'All-in-one wireless printer', 699.00, 3, 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=80"]'::jsonb, 18, 'HP', 'DeskJet 2720', '{"functions": "Print, Scan, Copy", "connectivity": "Wi-Fi, USB", "print_speed": "7.5 ppm", "cartridges": "HP 305"}'::jsonb),

-- Gaming Accessories
('SteelSeries Arctis 7', 'Wireless gaming headset with DTS support', 899.00, 4, 'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=80"]'::jsonb, 30, 'SteelSeries', 'Arctis 7', '{"battery": "24 hours", "connectivity": "2.4GHz wireless", "drivers": "40mm", "microphone": "Retractable"}'::jsonb),

('Logitech G502 HERO', 'High-performance gaming mouse', 449.00, 4, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"]'::jsonb, 40, 'Logitech', 'G502 HERO', '{"dpi": "25600", "buttons": "11", "sensor": "HERO 25K", "weight": "Adjustable"}'::jsonb),

-- TV & Home Entertainment
('TCL 43" Smart TV', '43-inch Android TV with HDR support', 2299.00, 3, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80"]'::jsonb, 15, 'TCL', '43P615', '{"size": "43 inch", "resolution": "4K Ultra HD", "smart_tv": "Android TV", "hdr": "HDR10, Dolby Vision"}'::jsonb);
