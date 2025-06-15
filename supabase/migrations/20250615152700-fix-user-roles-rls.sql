
-- Drop existing restrictive policies on user_roles
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Allow any authenticated user to read all user roles.
-- This is crucial for the has_role() function to work correctly across the application,
-- which in turn allows product and other admin policies to function as expected.
CREATE POLICY "Authenticated users can read all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

-- To prevent potential RLS recursion issues, we'll restrict modification of roles
-- to only the super admin for now.
-- A more advanced role management system for other admins can be built later using secure functions.
CREATE POLICY "Super admin can manage user roles"
ON public.user_roles
FOR INSERT, UPDATE, DELETE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'admin@darlingtonstore.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'admin@darlingtonstore.com');
