
-- Add product variants table for size, color, etc.
CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id integer REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  variant_name text NOT NULL, -- e.g., "Size", "Color"
  variant_value text NOT NULL, -- e.g., "Large", "Red"
  price_adjustment numeric DEFAULT 0, -- Additional cost for this variant
  stock_quantity integer DEFAULT 0,
  sku text, -- Stock Keeping Unit
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add inventory movements table for tracking stock changes
CREATE TABLE public.inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id integer REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE CASCADE,
  movement_type text NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity integer NOT NULL,
  reason text, -- e.g., "Purchase", "Sale", "Damaged", "Return"
  reference_id uuid, -- Order ID, Purchase Order ID, etc.
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Add product tags table for better categorization
CREATE TABLE public.product_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text DEFAULT '#gray', -- For UI display
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Junction table for products and tags (many-to-many)
CREATE TABLE public.product_tag_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id integer REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  tag_id uuid REFERENCES public.product_tags(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(product_id, tag_id)
);

-- Add more columns to products table
ALTER TABLE public.products 
ADD COLUMN sku text,
ADD COLUMN weight numeric,
ADD COLUMN dimensions jsonb DEFAULT '{}', -- {length, width, height, unit}
ADD COLUMN featured boolean DEFAULT false,
ADD COLUMN meta_title text,
ADD COLUMN meta_description text,
ADD COLUMN status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'discontinued'));

-- Update existing is_active to use new status field
UPDATE public.products SET status = CASE 
  WHEN is_active = true THEN 'active' 
  ELSE 'inactive' 
END;

-- Add indexes for better performance
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_inventory_movements_product_id ON public.inventory_movements(product_id);
CREATE INDEX idx_product_tag_assignments_product_id ON public.product_tag_assignments(product_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_featured ON public.products(featured);

-- Enable RLS on new tables
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tag_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admins can manage product variants" ON public.product_variants
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage inventory movements" ON public.inventory_movements
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage product tags" ON public.product_tags
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage product tag assignments" ON public.product_tag_assignments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Allow public read access to product variants and tags for display
CREATE POLICY "Public can view active product variants" ON public.product_variants
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active product tags" ON public.product_tags
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view product tag assignments" ON public.product_tag_assignments
  FOR SELECT USING (true);
