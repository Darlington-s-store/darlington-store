
-- Add more diverse electronics products with unique images from various categories
INSERT INTO public.products (name, description, price, category_id, image_url, images, stock_quantity, brand, model, specifications) VALUES

-- WiFi & Networking
('TP-Link Archer AX73', 'AX5400 Dual Band Gigabit Wi-Fi 6 Router', 599.00, 3, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80"]'::jsonb, 35, 'TP-Link', 'Archer AX73', '{"wifi_standard": "Wi-Fi 6", "speed": "5400 Mbps", "antenna": "6 antennas", "coverage": "3000 sq ft", "ports": "4 Gigabit LAN"}'::jsonb),

('Netgear Nighthawk X6', 'AC3200 Tri-Band WiFi Router with Dynamic QoS', 799.00, 3, 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80"]'::jsonb, 20, 'Netgear', 'Nighthawk X6', '{"wifi_standard": "802.11ac", "speed": "3200 Mbps", "bands": "Tri-band", "beamforming": "Yes", "guest_network": "Yes"}'::jsonb),

('Linksys Velop AX4200', 'Mesh WiFi 6 System for whole home coverage', 899.00, 3, 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80"]'::jsonb, 15, 'Linksys', 'Velop AX4200', '{"wifi_standard": "Wi-Fi 6", "speed": "4200 Mbps", "nodes": "3-pack", "coverage": "6000 sq ft", "mesh": "Intelligent Mesh"}'::jsonb),

-- More Smartphones with unique features
('Google Pixel 7a', 'AI-powered camera with Magic Eraser and Real Tone', 2199.00, 2, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80"]'::jsonb, 30, 'Google', 'Pixel 7a', '{"storage": "128GB", "camera": "64MP", "display": "6.1-inch OLED", "chip": "Google Tensor G2", "ram": "8GB"}'::jsonb),

('OnePlus Nord 3', 'Fast charging flagship killer with OxygenOS', 1799.00, 2, 'https://images.unsplash.com/photo-1567593810070-7a3d471af022?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1567593810070-7a3d471af022?auto=format&fit=crop&w=800&q=80"]'::jsonb, 40, 'OnePlus', 'Nord 3', '{"storage": "256GB", "camera": "50MP", "display": "6.74-inch AMOLED", "charging": "80W SuperVOOC", "ram": "12GB"}'::jsonb),

('Realme GT Neo 5', 'Gaming smartphone with 240W fast charging', 1599.00, 2, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"]'::jsonb, 25, 'Realme', 'GT Neo 5', '{"storage": "256GB", "camera": "50MP", "display": "6.74-inch AMOLED", "charging": "240W", "processor": "Snapdragon 8+ Gen 1"}'::jsonb),

-- Tablets and iPads
('Samsung Galaxy Tab A8', 'Entertainment tablet with large display', 1299.00, 3, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"]'::jsonb, 45, 'Samsung', 'Galaxy Tab A8', '{"storage": "64GB", "display": "10.5-inch", "processor": "Unisoc Tiger T618", "ram": "4GB", "battery": "7040mAh"}'::jsonb),

('Lenovo Tab P11', 'Productivity tablet with keyboard support', 1599.00, 3, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80"]'::jsonb, 30, 'Lenovo', 'Tab P11', '{"storage": "128GB", "display": "11-inch 2K", "processor": "MediaTek Helio G90T", "ram": "6GB", "keyboard": "Optional"}'::jsonb),

-- Computer Accessories and Peripherals
('Corsair K70 RGB', 'Mechanical gaming keyboard with Cherry MX switches', 899.00, 3, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80"]'::jsonb, 35, 'Corsair', 'K70 RGB', '{"switches": "Cherry MX Red", "backlight": "RGB", "media_keys": "Dedicated", "wrist_rest": "Included", "software": "iCUE"}'::jsonb),

('Razer Basilisk V3', 'Ergonomic gaming mouse with 11 programmable buttons', 549.00, 3, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80"]'::jsonb, 50, 'Razer', 'Basilisk V3', '{"dpi": "26000", "buttons": "11", "sensor": "Focus Pro 30K", "lighting": "Chroma RGB", "scroll_wheel": "HyperScroll"}'::jsonb),

('LG 24" UltraGear Monitor', 'Full HD gaming monitor with 144Hz refresh rate', 1399.00, 3, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"]'::jsonb, 25, 'LG', '24GN600-B', '{"size": "24 inch", "resolution": "1920x1080", "refresh_rate": "144Hz", "response_time": "1ms", "panel": "IPS"}'::jsonb),

-- Smart Home and IoT Devices
('Amazon Echo Dot 5th Gen', 'Smart speaker with Alexa voice control', 299.00, 3, 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80"]'::jsonb, 60, 'Amazon', 'Echo Dot 5th Gen', '{"voice_assistant": "Alexa", "connectivity": "Wi-Fi, Bluetooth", "controls": "Voice, Touch", "sound": "Improved audio", "smart_home": "Hub compatible"}'::jsonb),

('Google Nest Hub', 'Smart display with Google Assistant', 599.00, 3, 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"]'::jsonb, 35, 'Google', 'Nest Hub', '{"display": "7-inch touchscreen", "voice_assistant": "Google Assistant", "camera": "None (privacy)", "smart_home": "Compatible", "streaming": "YouTube, Netflix"}'::jsonb),

-- Power Banks and Charging
('RAVPower 26800mAh', 'High-capacity portable charger with fast charging', 449.00, 3, 'https://images.unsplash.com/photo-1609592094083-3fd8fdd3ee11?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1609592094083-3fd8fdd3ee11?auto=format&fit=crop&w=800&q=80"]'::jsonb, 40, 'RAVPower', 'RP-PB201', '{"capacity": "26800mAh", "output": "30W", "ports": "3 USB + 1 USB-C", "charging": "Power Delivery", "display": "LED indicator"}'::jsonb),

('Belkin 3-in-1 Wireless Charger', 'Wireless charging station for iPhone, AirPods, Apple Watch', 699.00, 3, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80"]'::jsonb, 30, 'Belkin', '3-in-1', '{"compatibility": "iPhone, AirPods, Apple Watch", "power": "15W wireless", "design": "Foldable", "certification": "Qi certified", "cable": "USB-C"}'::jsonb),

-- Storage Solutions
('SanDisk Extreme Pro SSD', '1TB portable SSD with rugged design', 899.00, 3, 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=800&q=80"]'::jsonb, 25, 'SanDisk', 'Extreme Pro', '{"capacity": "1TB", "interface": "USB 3.2 Gen 2", "speed": "2000 MB/s", "protection": "IP55 rated", "encryption": "Password protection"}'::jsonb),

('Western Digital My Passport', '4TB portable hard drive for backup', 599.00, 3, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80"]'::jsonb, 35, 'Western Digital', 'My Passport', '{"capacity": "4TB", "interface": "USB 3.0", "compatibility": "PC, Mac", "software": "WD Backup", "warranty": "3 years"}'::jsonb),

-- Cameras and Photography
('GoPro HERO11 Black', 'Action camera with 5.3K video recording', 2199.00, 3, 'https://images.unsplash.com/photo-1520637836862-4d197d17c0a4?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1520637836862-4d197d17c0a4?auto=format&fit=crop&w=800&q=80"]'::jsonb, 20, 'GoPro', 'HERO11 Black', '{"video": "5.3K60", "photo": "27MP", "stabilization": "HyperSmooth 5.0", "waterproof": "10m", "battery": "Enduro battery"}'::jsonb),

('Fujifilm Instax Mini 11', 'Instant camera with automatic exposure', 399.00, 3, 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=800&q=80"]'::jsonb, 45, 'Fujifilm', 'Instax Mini 11', '{"film": "Instax Mini", "features": "Auto exposure", "selfie_mode": "Yes", "colors": "Multiple", "flash": "Automatic"}'::jsonb),

-- Drones and Tech Gadgets
('DJI Mini 3', 'Lightweight drone with 4K HDR video', 3299.00, 3, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80"]'::jsonb, 12, 'DJI', 'Mini 3', '{"video": "4K HDR", "weight": "249g", "flight_time": "38 minutes", "range": "10km", "obstacle_avoidance": "Tri-directional"}'::jsonb),

-- More Gaming Accessories
('HyperX Cloud Alpha S', 'Gaming headset with virtual 7.1 surround sound', 699.00, 4, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"]'::jsonb, 40, 'HyperX', 'Cloud Alpha S', '{"audio": "7.1 surround", "drivers": "50mm", "microphone": "Detachable", "compatibility": "Multi-platform", "controls": "Audio control mixer"}'::jsonb),

('Elgato Stream Deck', 'Content creator controller with customizable keys', 899.00, 4, 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=80"]'::jsonb, 25, 'Elgato', 'Stream Deck', '{"keys": "15 LCD keys", "software": "Stream Deck", "plugins": "Unlimited", "compatibility": "PC, Mac", "customization": "Full"}'::jsonb);
