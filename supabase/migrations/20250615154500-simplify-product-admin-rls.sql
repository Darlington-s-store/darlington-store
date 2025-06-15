
-- Drop existing policies on products to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Super admin can manage products" ON public.products;

-- Drop existing policies on categories to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Super admin can manage categories" ON public.categories;

-- Recreate a simple read policy for products for all authenticated users
CREATE POLICY "Anyone can read products"
ON public.products
FOR SELECT
TO authenticated
USING (true);

-- Recreate a single, simplified management policy for products, restricted to the super admin.
-- This helps diagnose if the 'has_role' function is the source of the issue.
CREATE POLICY "Super admin can manage products"
ON public.products
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email') = 'admin@darlingtonstore.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'admin@darlingtonstore.com');


-- Recreate a simple read policy for categories for all authenticated users
CREATE POLICY "Anyone can read categories"
ON public.categories
FOR SELECT
TO authenticated
USING (true);

-- Recreate a simplified management policy for categories, restricted to the super admin.
CREATE POLICY "Super admin can manage categories"
ON public.categories
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email') = 'admin@darlingtonstore.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'admin@darlingtonstore.com');
