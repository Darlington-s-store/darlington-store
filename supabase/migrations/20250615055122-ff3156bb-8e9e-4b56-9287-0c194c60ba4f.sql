
-- Fix the RLS policies to avoid the 406 errors and allow proper access
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin email can manage all roles" ON public.user_roles;

-- Create a policy that allows authenticated users to read user_roles
-- This avoids the 406 error by allowing broader read access
CREATE POLICY "Authenticated users can read user_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert their own roles
CREATE POLICY "Users can insert their own roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow updates and deletes for admin email or own roles
CREATE POLICY "Users can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'admin@darlingtonstore.com'
  )
)
WITH CHECK (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'admin@darlingtonstore.com'
  )
);
