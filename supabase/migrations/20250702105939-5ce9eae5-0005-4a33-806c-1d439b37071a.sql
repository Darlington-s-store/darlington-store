
-- First, let's ensure we have some sample featured products with proper image data
-- Update existing products to be featured and have proper image structure
UPDATE products 
SET 
  featured = true,
  images = CASE 
    WHEN image_url IS NOT NULL THEN jsonb_build_array(image_url)
    ELSE '[]'::jsonb
  END,
  status = 'active'
WHERE id IN (
  SELECT id FROM products 
  WHERE is_active = true 
  ORDER BY created_at DESC 
  LIMIT 4
);

-- If we don't have enough products, let's insert some sample ones
INSERT INTO products (name, description, price, brand, image_url, images, featured, is_active, status, stock_quantity)
SELECT * FROM (
  VALUES 
    ('iPhone 15 Pro Max', 'Latest iPhone with A17 Pro chip and titanium design', 8999.00, 'Apple', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"]'::jsonb, true, true, 'active', 10),
    ('MacBook Air M3', 'Ultra-thin laptop with M3 chip and all-day battery', 6999.00, 'Apple', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80"]'::jsonb, true, true, 'active', 5),
    ('Samsung Galaxy S24 Ultra', 'Premium Android smartphone with S Pen and AI features', 7499.00, 'Samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80"]'::jsonb, true, true, 'active', 8),
    ('PlayStation 5', 'Next-generation gaming console with 4K gaming', 3799.00, 'Sony', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"]'::jsonb, true, true, 'active', 3)
) AS new_products(name, description, price, brand, image_url, images, featured, is_active, status, stock_quantity)
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE featured = true AND is_active = true
  HAVING COUNT(*) >= 4
);

-- Ensure we have some categories for the products
INSERT INTO categories (name, description, is_active)
VALUES 
  ('Smartphones', 'Latest smartphones and mobile devices', true),
  ('Laptops', 'Computers and laptops for work and gaming', true),
  ('Gaming', 'Gaming consoles and accessories', true),
  ('Electronics', 'Various electronic devices and gadgets', true)
ON CONFLICT DO NOTHING;

-- Update products to have category associations
UPDATE products 
SET category_id = (
  CASE 
    WHEN brand = 'Apple' AND name LIKE '%iPhone%' THEN (SELECT id FROM categories WHERE name = 'Smartphones' LIMIT 1)
    WHEN brand = 'Samsung' AND name LIKE '%Galaxy%' THEN (SELECT id FROM categories WHERE name = 'Smartphones' LIMIT 1)
    WHEN name LIKE '%MacBook%' THEN (SELECT id FROM categories WHERE name = 'Laptops' LIMIT 1)
    WHEN name LIKE '%PlayStation%' THEN (SELECT id FROM categories WHERE name = 'Gaming' LIMIT 1)
    ELSE (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1)
  END
)
WHERE category_id IS NULL;

-- Create an index on featured products for better query performance
CREATE INDEX IF NOT EXISTS idx_products_featured_active ON products (featured, is_active, created_at DESC);

-- Create an index for faster product queries
CREATE INDEX IF NOT EXISTS idx_products_status_active ON products (status, is_active, created_at DESC);
