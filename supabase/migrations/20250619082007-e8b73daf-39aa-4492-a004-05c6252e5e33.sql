
-- Fix the products status values and add the 100 products
-- First, let's check what status values are allowed and use 'active' instead of 'published'

-- Add 100 diverse products across all categories (Fixed status values)
INSERT INTO public.products (name, description, price, brand, model, category_id, stock_quantity, image_url, sku, featured, status) VALUES
-- Electronics Category (category_id 1)
('iPhone 15 Pro Max', 'Latest Apple flagship with titanium design and A17 Pro chip', 4999.00, 'Apple', 'iPhone 15 Pro Max', 1, 25, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', 'IP15PM001', true, 'active'),
('Samsung Galaxy S24 Ultra', 'Premium Android flagship with S Pen and AI features', 4599.00, 'Samsung', 'Galaxy S24 Ultra', 1, 30, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', 'SGS24U001', true, 'active'),
('MacBook Pro 16"', 'Powerful laptop with M3 Pro chip for professionals', 8999.00, 'Apple', 'MacBook Pro 16"', 1, 15, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500', 'MBP16001', true, 'active'),
('Dell XPS 15', 'Premium Windows laptop with OLED display', 6999.00, 'Dell', 'XPS 15', 1, 20, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', 'DXPS15001', false, 'active'),
('iPad Air M2', 'Versatile tablet for work and creativity', 2299.00, 'Apple', 'iPad Air M2', 1, 35, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 'IPA5M2001', true, 'active'),
('Sony WH-1000XM5', 'Industry-leading noise canceling headphones', 1299.00, 'Sony', 'WH-1000XM5', 1, 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'SWXM5001', false, 'active'),
('AirPods Pro 2nd Gen', 'Premium wireless earbuds with spatial audio', 899.00, 'Apple', 'AirPods Pro 2', 1, 60, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500', 'APP2001', true, 'active'),
('Samsung 55" QLED TV', '4K Smart TV with Quantum Dot technology', 2999.00, 'Samsung', 'QN55Q80C', 1, 12, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500', 'SQ55001', false, 'active'),
('Nintendo Switch OLED', 'Portable gaming console with vibrant OLED screen', 1299.00, 'Nintendo', 'Switch OLED', 1, 40, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', 'NSW001', true, 'active'),
('PlayStation 5', 'Next-gen gaming console with ray tracing', 1999.00, 'Sony', 'PlayStation 5', 1, 8, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500', 'PS5001', true, 'active'),
('Xbox Series X', 'Powerful 4K gaming console', 1899.00, 'Microsoft', 'Xbox Series X', 1, 10, 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500', 'XSX001', false, 'active'),
('Canon EOS R5', 'Professional mirrorless camera with 8K video', 12999.00, 'Canon', 'EOS R5', 1, 5, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500', 'CR5001', false, 'active'),
('GoPro Hero 12', 'Action camera for adventure recording', 1599.00, 'GoPro', 'Hero 12', 1, 25, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', 'GH12001', false, 'active'),
('Apple Watch Series 9', 'Advanced smartwatch with health monitoring', 1499.00, 'Apple', 'Watch Series 9', 1, 45, 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500', 'AWS9001', true, 'active'),
('Samsung Galaxy Watch 6', 'Android smartwatch with comprehensive health tracking', 1199.00, 'Samsung', 'Galaxy Watch 6', 1, 30, 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500', 'SGW6001', false, 'active'),

-- Fashion Category (category_id 2)
('Nike Air Jordan 1', 'Classic basketball sneakers with iconic design', 699.00, 'Nike', 'Air Jordan 1', 2, 50, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', 'NAJ1001', true, 'active'),
('Adidas Ultraboost 22', 'Premium running shoes with boost technology', 549.00, 'Adidas', 'Ultraboost 22', 2, 40, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'AUB22001', false, 'active'),
('Levis 501 Original Jeans', 'Classic straight-fit denim jeans', 299.00, 'Levis', '501 Original', 2, 75, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', 'L501001', false, 'active'),
('Ralph Lauren Polo Shirt', 'Classic cotton polo shirt', 199.00, 'Ralph Lauren', 'Classic Polo', 2, 100, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500', 'RLPS001', false, 'active'),
('Calvin Klein Underwear Set', 'Premium cotton underwear 3-pack', 149.00, 'Calvin Klein', 'Cotton Classic', 2, 80, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', 'CKU001', false, 'active'),
('Ray-Ban Aviator Sunglasses', 'Classic pilot sunglasses', 399.00, 'Ray-Ban', 'Aviator Classic', 2, 60, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', 'RBA001', true, 'active'),
('Gucci Belt', 'Luxury leather belt with signature buckle', 1299.00, 'Gucci', 'GG Belt', 2, 25, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 'GB001', true, 'active'),
('Nike Dri-FIT T-Shirt', 'Moisture-wicking athletic t-shirt', 89.00, 'Nike', 'Dri-FIT', 2, 120, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'NDT001', false, 'active'),
('Adidas Track Suit', 'Complete athletic wear set', 349.00, 'Adidas', '3-Stripes', 2, 45, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', 'ATS001', false, 'active'),
('Converse Chuck Taylor', 'Classic canvas sneakers', 199.00, 'Converse', 'Chuck Taylor All Star', 2, 85, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', 'CCT001', false, 'active'),
('H&M Casual Dress', 'Trendy casual summer dress', 129.00, 'H&M', 'Summer Casual', 2, 65, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', 'HCD001', false, 'active'),
('Zara Blazer', 'Professional blazer for office wear', 299.00, 'Zara', 'Office Blazer', 2, 35, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', 'ZB001', false, 'active'),
('Uniqlo Heattech Innerwear', 'Thermal underwear for cold weather', 89.00, 'Uniqlo', 'Heattech', 2, 90, 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500', 'UHI001', false, 'active'),
('Puma Running Shorts', 'Lightweight athletic shorts', 79.00, 'Puma', 'DryCell', 2, 110, 'https://images.unsplash.com/photo-1506629905607-45c049783fe6?w=500', 'PRS001', false, 'active'),
('Tommy Hilfiger Hoodie', 'Classic cotton hoodie with logo', 249.00, 'Tommy Hilfiger', 'Classic Logo', 2, 55, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', 'THH001', false, 'active'),

-- Home & Garden Category (category_id 3)
('Dyson V15 Vacuum', 'Cordless vacuum with laser detection', 2499.00, 'Dyson', 'V15 Detect', 3, 20, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 'DV15001', true, 'active'),
('Instant Pot Duo 7-in-1', 'Multi-functional pressure cooker', 399.00, 'Instant Pot', 'Duo 7-in-1', 3, 40, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 'IP7001', false, 'active'),
('KitchenAid Stand Mixer', 'Professional stand mixer for baking', 1299.00, 'KitchenAid', 'Artisan Series', 3, 15, 'https://images.unsplash.com/photo-1556909114-4f6e7ad7d3136?w=500', 'KSM001', true, 'active'),
('Roomba i7+ Robot Vacuum', 'Smart robot vacuum with auto-empty base', 1999.00, 'iRobot', 'Roomba i7+', 3, 12, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 'RI7001', false, 'active'),
('Philips Air Fryer XXL', 'Large capacity air fryer for healthy cooking', 699.00, 'Philips', 'Air Fryer XXL', 3, 30, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 'PAF001', false, 'active'),
('Nespresso Vertuo Plus', 'Premium coffee machine with capsule system', 899.00, 'Nespresso', 'Vertuo Plus', 3, 25, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', 'NVP001', false, 'active'),
('Weber Genesis II Grill', 'Premium gas grill for outdoor cooking', 2999.00, 'Weber', 'Genesis II', 3, 8, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=500', 'WG2001', false, 'active'),
('Shark Navigator Vacuum', 'Upright vacuum with lift-away feature', 599.00, 'Shark', 'Navigator', 3, 35, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 'SN001', false, 'active'),
('Cuisinart Food Processor', '14-cup food processor for meal prep', 449.00, 'Cuisinart', '14-Cup', 3, 20, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 'CFP001', false, 'active'),
('Breville Espresso Machine', 'Semi-automatic espresso maker', 1599.00, 'Breville', 'Barista Express', 3, 10, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', 'BEM001', false, 'active'),
('All-Clad Cookware Set', 'Professional stainless steel cookware', 1999.00, 'All-Clad', 'D3 Stainless', 3, 15, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 'ACS001', true, 'active'),
('Lodge Cast Iron Skillet', 'Pre-seasoned cast iron cookware', 129.00, 'Lodge', 'Cast Iron', 3, 60, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 'LCI001', false, 'active'),
('Vitamix Blender', 'High-performance blender for smoothies', 1299.00, 'Vitamix', '5200 Series', 3, 18, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 'VB001', false, 'active'),
('Keurig K-Elite Coffee Maker', 'Single-serve coffee maker with K-cups', 499.00, 'Keurig', 'K-Elite', 3, 45, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', 'KKE001', false, 'active'),
('Hamilton Beach Microwave', 'Countertop microwave with sensor cooking', 299.00, 'Hamilton Beach', '1.1 Cu Ft', 3, 40, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 'HBM001', false, 'active'),

-- Sports & Outdoors Category (category_id 4)
('Peloton Bike+', 'Interactive fitness bike with live classes', 8999.00, 'Peloton', 'Bike+', 4, 5, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', 'PB001', true, 'active'),
('NordicTrack Treadmill', 'Incline trainer with iFit technology', 4999.00, 'NordicTrack', 'Commercial X22i', 4, 8, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', 'NTT001', false, 'active'),
('Bowflex Dumbbells', 'Adjustable dumbbells for home gym', 1299.00, 'Bowflex', 'SelectTech 552', 4, 20, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', 'BD001', false, 'active'),
('Yeti Cooler', 'Premium ice chest for outdoor adventures', 899.00, 'Yeti', 'Tundra 45', 4, 15, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=500', 'YC001', false, 'active'),
('REI Co-op Tent', '4-person camping tent with vestibule', 699.00, 'REI Co-op', 'Half Dome 4', 4, 25, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500', 'RCT001', false, 'active'),
('Patagonia Down Jacket', 'Lightweight down insulation jacket', 799.00, 'Patagonia', 'Down Sweater', 4, 30, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=500', 'PDJ001', true, 'active'),
('Coleman Sleeping Bag', 'All-season sleeping bag for camping', 199.00, 'Coleman', 'Big Bay', 4, 50, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500', 'CSB001', false, 'active'),
('Hydro Flask Water Bottle', 'Insulated stainless steel water bottle', 149.00, 'Hydro Flask', '32 oz Wide Mouth', 4, 100, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=500', 'HF001', false, 'active'),
('GoPro Accessories Kit', 'Complete accessory kit for action cameras', 299.00, 'GoPro', 'Adventure Kit', 4, 40, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', 'GA001', false, 'active'),
('Wilson Tennis Racket', 'Professional tennis racket', 399.00, 'Wilson', 'Pro Staff', 4, 25, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=500', 'WTR001', false, 'active'),
('Spalding Basketball', 'Official size basketball', 89.00, 'Spalding', 'NBA Official', 4, 80, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=500', 'SB001', false, 'active'),
('Under Armour Gym Bag', 'Durable gym bag with multiple compartments', 199.00, 'Under Armour', 'Undeniable Duffle', 4, 45, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=500', 'UGB001', false, 'active'),
('Fitbit Charge 5', 'Advanced fitness tracker with GPS', 499.00, 'Fitbit', 'Charge 5', 4, 60, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', 'FC5001', false, 'active'),
('Garmin Forerunner Watch', 'GPS running watch for athletes', 899.00, 'Garmin', 'Forerunner 255', 4, 35, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', 'GF001', false, 'active'),
('Theragun Massage Gun', 'Percussive therapy device for recovery', 699.00, 'Theragun', 'Prime', 4, 20, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', 'TG001', false, 'active'),

-- Books Category (category_id 5)
('The Psychology of Money', 'Financial wisdom and behavioral economics', 59.00, 'Harcourt', 'Paperback', 5, 100, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'TPM001', true, 'active'),
('Atomic Habits', 'Guide to building good habits and breaking bad ones', 49.00, 'Avery', 'Hardcover', 5, 150, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'AH001', true, 'active'),
('The 7 Habits of Highly Effective People', 'Personal development classic', 45.00, 'Free Press', 'Paperback', 5, 80, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', '7H001', false, 'active'),
('Sapiens: A Brief History of Humankind', 'Anthropological examination of human history', 55.00, 'Harper', 'Paperback', 5, 90, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'SAP001', true, 'active'),
('Think and Grow Rich', 'Classic personal success philosophy', 39.00, 'TarcherPerigee', 'Paperback', 5, 120, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'TGR001', false, 'active'),
('The Lean Startup', 'Entrepreneurship and business development', 49.00, 'Crown Business', 'Paperback', 5, 70, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'TLS001', false, 'active'),
('Good to Great', 'Business strategy and leadership', 52.00, 'HarperBusiness', 'Hardcover', 5, 60, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'GTG001', false, 'active'),
('The Power of Now', 'Spiritual awakening and mindfulness', 42.00, 'New World Library', 'Paperback', 5, 85, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'PON001', false, 'active'),
('Rich Dad Poor Dad', 'Financial education and investment', 47.00, 'Plata Publishing', 'Paperback', 5, 110, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'RDP001', true, 'active'),
('The Alchemist', 'Philosophical novel about following dreams', 35.00, 'HarperOne', 'Paperback', 5, 140, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'ALC001', false, 'active'),
('How to Win Friends and Influence People', 'Social skills and relationship building', 44.00, 'Pocket Books', 'Paperback', 5, 95, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'HWF001', false, 'active'),
('The 4-Hour Workweek', 'Lifestyle design and productivity', 48.00, 'Harmony Books', 'Paperback', 5, 75, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', '4HW001', false, 'active'),
('Mindset: The New Psychology of Success', 'Growth mindset and personal development', 46.00, 'Ballantine Books', 'Paperback', 5, 65, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'MIN001', false, 'active'),
('The Subtle Art of Not Giving a F*ck', 'Counterintuitive approach to living well', 43.00, 'HarperOne', 'Paperback', 5, 105, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'SAF001', false, 'active'),
('Zero to One', 'Notes on startups and building the future', 50.00, 'Crown Business', 'Hardcover', 5, 55, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'ZTO001', false, 'active'),

-- Beauty & Personal Care Category (assuming category_id 6 if it exists, otherwise category_id 3)
('Olay Regenerist Serum', 'Anti-aging serum with peptides', 129.00, 'Olay', 'Regenerist', 3, 80, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'ORS001', false, 'active'),
('The Ordinary Niacinamide', 'Serum for blemishes and enlarged pores', 29.00, 'The Ordinary', 'Niacinamide 10%', 3, 150, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'TON001', true, 'active'),
('Cetaphil Gentle Cleanser', 'Gentle face wash for sensitive skin', 39.00, 'Cetaphil', 'Daily Facial Cleanser', 3, 120, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'CGC001', false, 'active'),
('Neutrogena Sunscreen SPF 50', 'Broad spectrum sun protection', 45.00, 'Neutrogena', 'Ultra Sheer', 3, 100, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'NSS001', false, 'active'),
('L Oreal Paris Mascara', 'Voluminous mascara for dramatic lashes', 35.00, 'L Oreal Paris', 'Voluminous', 3, 90, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'LPM001', false, 'active'),
('Maybelline Foundation', 'Full coverage liquid foundation', 42.00, 'Maybelline', 'Fit Me', 3, 75, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'MF001', false, 'active'),
('Clinique Moisturizer', 'Dramatically different moisturizing lotion', 85.00, 'Clinique', 'Dramatically Different', 3, 60, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'CM001', false, 'active'),
('Urban Decay Eyeshadow Palette', 'Naked eyeshadow palette', 159.00, 'Urban Decay', 'Naked3', 3, 40, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'UDE001', true, 'active'),
('Fenty Beauty Lipstick', 'Universal lip color by Rihanna', 69.00, 'Fenty Beauty', 'Stunna Lip Paint', 3, 85, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'FBL001', false, 'active'),
('Dove Body Wash', 'Moisturizing body wash with 1/4 moisturizer', 25.00, 'Dove', 'Deep Moisture', 3, 140, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'DBW001', false, 'active'),
('Head & Shoulders Shampoo', 'Anti-dandruff shampoo for daily use', 32.00, 'Head & Shoulders', 'Classic Clean', 3, 110, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'HSS001', false, 'active'),
('Pantene Conditioner', 'Pro-V repair and protect conditioner', 28.00, 'Pantene', 'Pro-V', 3, 125, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'PC001', false, 'active'),
('Garnier Face Mask', 'Hydrating sheet mask with hyaluronic acid', 15.00, 'Garnier', 'HydraHolic', 3, 200, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'GFM001', false, 'active'),
('Nivea Body Lotion', 'Intensive moisture body lotion', 22.00, 'Nivea', 'Essentially Enriched', 3, 160, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', '4NBL001', false, 'active'),
('Oral-B Electric Toothbrush', 'Rechargeable electric toothbrush', 199.00, 'Oral-B', 'Pro 1000', 3, 45, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 'OBE001', false, 'active');

-- Update orders table to improve status tracking
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id_created_at ON public.orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_featured ON public.products(category_id, featured);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
