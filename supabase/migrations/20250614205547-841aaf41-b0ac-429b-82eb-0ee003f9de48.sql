
-- Insert more electronics products based on Jumia Ghana categories
INSERT INTO public.products (name, description, price, category_id, image_url, images, stock_quantity, brand, model, specifications) VALUES
-- More Smartphones
('Samsung Galaxy A54 5G', 'Mid-range smartphone with excellent camera and 5G connectivity', 1899.00, 2, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"]'::jsonb, 35, 'Samsung', 'Galaxy A54 5G', '{"storage": "128GB", "camera": "50MP", "display": "6.4-inch Super AMOLED", "battery": "5000mAh", "ram": "8GB"}'::jsonb),

('iPhone 14', 'Latest iPhone with advanced dual-camera system and all-day battery', 4299.00, 2, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80"]'::jsonb, 18, 'Apple', 'iPhone 14', '{"storage": "128GB", "camera": "48MP", "display": "6.1-inch Super Retina XDR", "chip": "A15 Bionic", "ram": "6GB"}'::jsonb),

('Tecno Camon 20 Pro', 'Affordable smartphone with premium camera features', 1299.00, 2, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"]'::jsonb, 45, 'Tecno', 'Camon 20 Pro', '{"storage": "256GB", "camera": "64MP", "display": "6.67-inch AMOLED", "battery": "5000mAh", "ram": "8GB"}'::jsonb),

-- More Laptops
('HP Pavilion 15', 'Reliable laptop for everyday computing and productivity', 2899.00, 1, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"]'::jsonb, 22, 'HP', 'Pavilion 15', '{"processor": "Intel Core i5", "ram": "8GB", "storage": "512GB SSD", "display": "15.6-inch Full HD", "graphics": "Intel Iris Xe"}'::jsonb),

('Lenovo ThinkPad E14', 'Business laptop with robust security and performance', 3299.00, 1, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"]'::jsonb, 16, 'Lenovo', 'ThinkPad E14', '{"processor": "AMD Ryzen 5", "ram": "16GB", "storage": "512GB SSD", "display": "14-inch Full HD", "graphics": "AMD Radeon"}'::jsonb),

('Acer Aspire 3', 'Budget-friendly laptop for students and basic computing', 1699.00, 1, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"]'::jsonb, 30, 'Acer', 'Aspire 3', '{"processor": "Intel Core i3", "ram": "4GB", "storage": "1TB HDD", "display": "15.6-inch HD", "graphics": "Intel UHD"}'::jsonb),

-- Audio Products
('JBL Tune 510BT', 'Wireless on-ear headphones with powerful bass', 299.00, 5, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]'::jsonb, 60, 'JBL', 'Tune 510BT', '{"battery": "40 hours", "connectivity": "Bluetooth 5.0", "drivers": "32mm", "charging": "USB-C"}'::jsonb),

('Bose QuietComfort 45', 'Premium noise-cancelling headphones for audiophiles', 1599.00, 5, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]'::jsonb, 25, 'Bose', 'QuietComfort 45', '{"battery": "24 hours", "noise_canceling": "Active", "connectivity": "Bluetooth 5.1", "drivers": "TriPort"}'::jsonb),

('Apple AirPods Pro 2', 'True wireless earbuds with spatial audio', 1299.00, 5, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]'::jsonb, 35, 'Apple', 'AirPods Pro 2', '{"battery": "6 hours + 24 with case", "noise_canceling": "Active", "connectivity": "Bluetooth 5.3", "chip": "H2"}'::jsonb),

-- Gaming Products
('PlayStation 5', 'Next-gen gaming console with lightning-fast SSD', 4999.00, 4, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"]'::jsonb, 8, 'Sony', 'PlayStation 5', '{"storage": "825GB SSD", "gpu": "AMD RDNA 2", "cpu": "AMD Zen 2", "ram": "16GB GDDR6", "resolution": "4K 120fps"}'::jsonb),

('Xbox Series X', 'Powerful gaming console with 4K gaming capabilities', 4799.00, 4, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"]'::jsonb, 10, 'Microsoft', 'Xbox Series X', '{"storage": "1TB SSD", "gpu": "AMD RDNA 2", "cpu": "AMD Zen 2", "ram": "16GB GDDR6", "resolution": "4K 120fps"}'::jsonb),

('Razer DeathAdder V3', 'Professional gaming mouse with precision sensor', 349.00, 4, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"]'::jsonb, 50, 'Razer', 'DeathAdder V3', '{"dpi": "30000", "buttons": "8", "connectivity": "Wired/Wireless", "battery": "90 hours"}'::jsonb),

-- Accessories
('Samsung 27" Curved Monitor', 'Ultra-wide curved monitor for productivity and gaming', 1899.00, 3, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"]'::jsonb, 20, 'Samsung', 'C27F396FHU', '{"size": "27 inch", "resolution": "1920x1080", "refresh_rate": "60Hz", "curve": "1800R", "ports": "HDMI, VGA"}'::jsonb),

('Logitech MX Master 3', 'Advanced wireless mouse for professionals', 599.00, 3, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"]'::jsonb, 40, 'Logitech', 'MX Master 3', '{"dpi": "4000", "battery": "70 days", "connectivity": "Bluetooth/USB", "scroll": "MagSpeed"}'::jsonb),

('Anker PowerCore 10000', 'Portable power bank with fast charging', 199.00, 3, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"]'::jsonb, 80, 'Anker', 'PowerCore 10000', '{"capacity": "10000mAh", "output": "12W", "input": "10W", "ports": "USB-A, USB-C"}'::jsonb),

('Apple USB-C to Lightning Cable', 'Official Apple charging and sync cable', 89.00, 3, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"]'::jsonb, 100, 'Apple', 'USB-C to Lightning', '{"length": "1m", "power": "Fast charging", "data": "USB 2.0", "compatibility": "iPhone, iPad"}'::jsonb),

-- Tablets and More Electronics
('iPad Air 5th Gen', 'Powerful tablet with M1 chip for work and creativity', 3499.00, 3, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"]'::jsonb, 15, 'Apple', 'iPad Air 5', '{"storage": "64GB", "chip": "Apple M1", "display": "10.9-inch Liquid Retina", "camera": "12MP", "connectivity": "Wi-Fi 6"}'::jsonb),

('Samsung Galaxy Tab S8', 'Android tablet with S Pen for productivity', 2799.00, 3, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"]'::jsonb, 25, 'Samsung', 'Galaxy Tab S8', '{"storage": "128GB", "processor": "Snapdragon 8 Gen 1", "display": "11-inch", "ram": "8GB", "s_pen": "Included"}'::jsonb);
