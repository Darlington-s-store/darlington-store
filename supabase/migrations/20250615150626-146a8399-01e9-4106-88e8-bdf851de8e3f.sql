
-- Drop potentially recursive RLS policies on the user_roles table
DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Recreate policies on user_roles to avoid recursion

-- This policy allows the primary admin to manage roles, breaking the recursive loop.
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email') = 'admin@darlingtonstore.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'admin@darlingtonstore.com');

-- This policy safely allows users to see their own roles.
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
