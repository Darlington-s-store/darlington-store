
-- Add more diverse products to the store
INSERT INTO products (name, description, price, brand, stock_quantity, image_url, category_id, is_active, featured, images, specifications) VALUES
-- Smartphones
('iPhone 15 Pro Max', 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system', 8999.00, 'Apple', 25, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', 1, true, true, '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1695654389310-c0ed5154083a?auto=format&fit=crop&w=800&q=80"]', '{"storage": "256GB", "color": "Natural Titanium", "display": "6.7-inch Super Retina XDR", "camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto"}'),
('Samsung Galaxy S24 Ultra', 'Premium Android phone with S Pen, 200MP camera, and AI features', 7499.00, 'Samsung', 30, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', 1, true, true, '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80"]', '{"storage": "512GB", "color": "Titanium Gray", "display": "6.8-inch Dynamic AMOLED 2X", "camera": "200MP Main + 50MP Periscope Telephoto + 12MP Ultra Wide + 10MP Telephoto"}'),
('Google Pixel 8 Pro', 'AI-powered photography with Magic Eraser and enhanced Google features', 5999.00, 'Google', 20, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80', 1, true, false, '["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80"]', '{"storage": "128GB", "color": "Obsidian", "display": "6.7-inch LTPO OLED", "camera": "50MP Main + 48MP Ultra Wide + 48MP Telephoto"}'),

-- Laptops
('MacBook Air M3', 'Ultra-thin laptop with M3 chip, all-day battery life, and stunning Liquid Retina display', 6999.00, 'Apple', 15, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80', 2, true, true, '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"]', '{"processor": "Apple M3", "memory": "16GB", "storage": "512GB SSD", "display": "13.6-inch Liquid Retina", "weight": "1.24kg"}'),
('Dell XPS 13 Plus', 'Premium ultrabook with 12th Gen Intel processors and InfinityEdge display', 5499.00, 'Dell', 12, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80', 2, true, true, '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"]', '{"processor": "Intel Core i7-1280P", "memory": "16GB", "storage": "1TB SSD", "display": "13.4-inch OLED", "weight": "1.26kg"}'),
('HP Spectre x360', '2-in-1 convertible laptop with premium design and long battery life', 4799.00, 'HP', 18, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80', 2, true, false, '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"]', '{"processor": "Intel Core i7-1355U", "memory": "16GB", "storage": "512GB SSD", "display": "13.5-inch OLED Touch", "weight": "1.34kg"}'),
('ASUS ROG Strix G15', 'Gaming laptop with RTX 4060, AMD Ryzen 7, and high refresh rate display', 6299.00, 'ASUS', 10, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', 2, true, true, '["https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"]', '{"processor": "AMD Ryzen 7 7735HS", "memory": "16GB DDR5", "storage": "1TB SSD", "graphics": "NVIDIA RTX 4060", "display": "15.6-inch 144Hz"}'),

-- Tablets
('iPad Pro 12.9-inch M2', 'Ultimate iPad experience with M2 chip and Liquid Retina XDR display', 4999.00, 'Apple', 20, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80', 3, true, true, '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"]', '{"processor": "Apple M2", "storage": "256GB", "display": "12.9-inch Liquid Retina XDR", "connectivity": "Wi-Fi 6E + 5G"}'),
('Samsung Galaxy Tab S9 Ultra', 'Large premium Android tablet with S Pen included', 4299.00, 'Samsung', 15, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80', 3, true, false, '["https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80"]', '{"processor": "Snapdragon 8 Gen 2", "storage": "256GB", "display": "14.6-inch Dynamic AMOLED 2X", "s_pen": "Included"}'),

-- Headphones & Audio
('AirPods Pro 2nd Gen', 'Active Noise Cancellation with Adaptive Transparency and spatial audio', 1299.00, 'Apple', 50, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80', 4, true, true, '["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80"]', '{"features": "Active Noise Cancellation, Spatial Audio", "battery": "6 hours + 30 hours with case", "connectivity": "Bluetooth 5.3"}'),
('Sony WH-1000XM5', 'Industry-leading noise canceling wireless headphones', 1899.00, 'Sony', 25, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80', 4, true, true, '["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80"]', '{"features": "30-hour battery, Quick Charge", "noise_cancellation": "V1 Processor", "connectivity": "Bluetooth 5.2, LDAC"}'),
('Bose QuietComfort 45', 'Comfortable noise cancelling headphones for all-day listening', 1599.00, 'Bose', 30, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80', 4, true, false, '["https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80"]', '{"battery": "24 hours", "weight": "238g", "features": "TriPort acoustic architecture"}'),

-- Smart Watches
('Apple Watch Series 9', 'Most advanced Apple Watch with S9 chip and Double Tap gesture', 2299.00, 'Apple', 35, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80', 5, true, true, '["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80"]', '{"display": "45mm Always-On Retina", "features": "Double Tap, Blood Oxygen, ECG", "battery": "18 hours"}'),
('Samsung Galaxy Watch6', 'Advanced health monitoring with sleep coaching and body composition', 1899.00, 'Samsung', 25, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', 5, true, false, '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"]', '{"display": "44mm Super AMOLED", "features": "Sleep Coaching, Body Composition", "battery": "40 hours"}'),

-- Gaming Accessories
('PlayStation 5', 'Next-gen gaming console with ultra-high speed SSD and ray tracing', 3999.00, 'Sony', 8, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80', 6, true, true, '["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"]', '{"storage": "825GB SSD", "features": "Ray Tracing, 3D Audio", "resolution": "Up to 8K"}'),
('Xbox Series X', 'Most powerful Xbox ever with 4K gaming at 60fps', 3799.00, 'Microsoft', 12, 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=80', 6, true, true, '["https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=80"]', '{"storage": "1TB SSD", "features": "Quick Resume, Smart Delivery", "resolution": "Up to 8K"}'),

-- Accessories
('MagSafe Charger', 'Wireless charger designed for iPhone with fast charging up to 15W', 299.00, 'Apple', 100, 'https://images.unsplash.com/photo-1558618047-3c8c76c7d4c4?auto=format&fit=crop&w=800&q=80', 7, true, false, '["https://images.unsplash.com/photo-1558618047-3c8c76c7d4c4?auto=format&fit=crop&w=800&q=80"]', '{"power": "15W", "compatibility": "iPhone 12 and later", "cable": "USB-C to Lightning"}'),
('Anker PowerBank 20000mAh', 'High-capacity portable charger with fast charging for multiple devices', 449.00, 'Anker', 75, 'https://images.unsplash.com/photo-1609592806293-7e5331d2b5ec?auto=format&fit=crop&w=800&q=80', 7, true, false, '["https://images.unsplash.com/photo-1609592806293-7e5331d2b5ec?auto=format&fit=crop&w=800&q=80"]', '{"capacity": "20000mAh", "ports": "USB-C + USB-A", "fast_charging": "PowerIQ 3.0"}');

-- Update some existing products to be featured
UPDATE products SET featured = true WHERE id IN (1, 2, 3, 4);

-- Add new categories (only if they don't exist)
INSERT INTO categories (name, description, image_url, is_active) 
SELECT 'Smartphones', 'Latest smartphones from top brands', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80', true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Smartphones');

INSERT INTO categories (name, description, image_url, is_active) 
SELECT 'Laptops', 'High-performance laptops for work and gaming', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=400&q=80', true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Laptops');

INSERT INTO categories (name, description, image_url, is_active) 
SELECT 'Tablets', 'Versatile tablets for productivity and entertainment', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80', true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Tablets');

INSERT INTO categories (name, description, image_url, is_active) 
SELECT 'Audio', 'Premium headphones and speakers', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80', true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Audio');

INSERT INTO categories (name, description, image_url, is_active) 
SELECT 'Wearables', 'Smart watches and fitness trackers', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=400&q=80', true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Wearables');

INSERT INTO categories (name, description, image_url, is_active) 
SELECT 'Gaming', 'Gaming consoles and accessories', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80', true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Gaming');

INSERT INTO categories (name, description, image_url, is_active) 
SELECT 'Accessories', 'Chargers, cases, and other accessories', 'https://images.unsplash.com/photo-1558618047-3c8c76c7d4c4?auto=format&fit=crop&w=400&q=80', true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Accessories');
