
-- Create categories table
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INTEGER REFERENCES public.categories(id),
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  brand TEXT,
  model TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert sample categories
INSERT INTO public.categories (name, description, image_url) VALUES
('Laptops', 'High-performance laptops for work and gaming', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'),
('Smartphones', 'Latest smartphones with cutting-edge technology', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'),
('Accessories', 'Essential tech accessories and peripherals', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'),
('Gaming', 'Gaming laptops, consoles and accessories', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'),
('Audio', 'Headphones, speakers and audio equipment', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');

-- Insert sample products
INSERT INTO public.products (name, description, price, category_id, image_url, images, stock_quantity, brand, model, specifications) VALUES
('MacBook Pro 16"', 'Powerful laptop with M3 Pro chip for professional work', 2499.99, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"]'::jsonb, 15, 'Apple', 'MacBook Pro 16"', '{"processor": "M3 Pro", "ram": "32GB", "storage": "1TB SSD", "display": "16-inch Liquid Retina XDR"}'::jsonb),
('iPhone 15 Pro', 'Latest iPhone with titanium design and advanced camera system', 1199.99, 2, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80"]'::jsonb, 25, 'Apple', 'iPhone 15 Pro', '{"storage": "256GB", "camera": "48MP", "display": "6.1-inch Super Retina XDR", "chip": "A17 Pro"}'::jsonb),
('Dell XPS 13', 'Ultra-portable laptop with stunning InfinityEdge display', 1299.99, 1, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"]'::jsonb, 20, 'Dell', 'XPS 13', '{"processor": "Intel Core i7", "ram": "16GB", "storage": "512GB SSD", "display": "13.4-inch FHD+"}'::jsonb),
('Samsung Galaxy S24', 'Flagship Android phone with AI-powered features', 899.99, 2, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"]'::jsonb, 30, 'Samsung', 'Galaxy S24', '{"storage": "256GB", "camera": "50MP", "display": "6.2-inch Dynamic AMOLED 2X", "processor": "Snapdragon 8 Gen 3"}'::jsonb),
('Sony WH-1000XM5', 'Premium noise-canceling wireless headphones', 399.99, 5, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]'::jsonb, 40, 'Sony', 'WH-1000XM5', '{"battery": "30 hours", "noise_canceling": "Industry-leading", "connectivity": "Bluetooth 5.2", "drivers": "30mm"}'::jsonb),
('Gaming Laptop ROG', 'High-performance gaming laptop with RTX 4080', 2199.99, 4, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"]'::jsonb, 12, 'ASUS', 'ROG Strix G16', '{"processor": "Intel Core i9", "gpu": "RTX 4080", "ram": "32GB", "storage": "1TB SSD", "display": "16-inch QHD 165Hz"}'::jsonb);

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);

-- Enable RLS on new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access to categories and products
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT TO authenticated, anon USING (is_active = true);

CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT TO authenticated, anon USING (is_active = true);
