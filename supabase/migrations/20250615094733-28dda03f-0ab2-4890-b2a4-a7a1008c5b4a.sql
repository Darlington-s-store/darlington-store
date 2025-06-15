
-- Drop existing RLS policies for products table
DROP POLICY IF EXISTS "Anyone can read products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Drop existing RLS policies for categories table
DROP POLICY IF EXISTS "Anyone can read categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

-- Recreate RLS policies for products table
-- Policy to allow all authenticated users to read products
CREATE POLICY "Anyone can read products"
ON public.products
FOR SELECT
TO authenticated
USING (true);

-- Policy to allow admins to insert products
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() ->> 'email') = 'admin@darlingtonstore.com' OR
  public.has_role(auth.uid(), 'admin')
);

-- Policy to allow admins to update products
CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'email') = 'admin@darlingtonstore.com' OR
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  (auth.jwt() ->> 'email') = 'admin@darlingtonstore.com' OR
  public.has_role(auth.uid(), 'admin')
);

-- Policy to allow admins to delete products
CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (
  (auth.jwt() ->> 'email') = 'admin@darlingtonstore.com' OR
  public.has_role(auth.uid(), 'admin')
);

-- Recreate RLS policies for categories table
CREATE POLICY "Anyone can read categories"
ON public.categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'email') = 'admin@darlingtonstore.com' OR
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  (auth.jwt() ->> 'email') = 'admin@darlingtonstore.com' OR
  public.has_role(auth.uid(), 'admin')
);
