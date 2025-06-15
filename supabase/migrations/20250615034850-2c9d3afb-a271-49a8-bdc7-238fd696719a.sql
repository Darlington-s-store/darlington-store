

-- First, let's ensure the RLS policies are set up correctly for user_roles
-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Authenticated users can view user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to read user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;

-- Create a simple policy that allows users to read their own roles
-- This avoids circular dependency issues
CREATE POLICY "Users can read their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow users to insert their own roles (needed for admin setup)
CREATE POLICY "Users can insert their own roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- For admin management, we'll use a separate approach that doesn't cause recursion
-- This policy allows updates and deletes based on a simple check
CREATE POLICY "Allow role management"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  -- Allow if it's the user's own role OR if they have admin email
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'admin@darlingtonstore.com'
  )
)
WITH CHECK (
  -- Same check for inserts/updates
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'admin@darlingtonstore.com'
  )
);

-- Update the has_role function to be more robust
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Simple check without causing RLS recursion
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
EXCEPTION
  WHEN OTHERS THEN
    -- If there's any error (like RLS blocking), return false
    RETURN false;
END;
$$;

-- Update the setup_admin_user function to be more robust
CREATE OR REPLACE FUNCTION public.setup_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Look for any user with the admin email
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@darlingtonstore.com';
    
    -- If admin user exists, ensure they have profile and admin role
    IF admin_user_id IS NOT NULL THEN
        -- Insert or update profile
        INSERT INTO public.profiles (id, first_name, last_name, email)
        VALUES (admin_user_id, 'Admin', 'User', 'admin@darlingtonstore.com')
        ON CONFLICT (id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            email = EXCLUDED.email;
        
        -- Insert admin role if it doesn't exist
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin user setup complete for user ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'No admin user found with email: admin@darlingtonstore.com';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in setup_admin_user: %', SQLERRM;
END;
$$;

-- Create a function to manually create admin user for testing
CREATE OR REPLACE FUNCTION public.create_test_admin()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_user_id uuid;
    result_message text;
BEGIN
    -- Check if admin user already exists
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@darlingtonstore.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- User exists, just ensure they have the right setup
        INSERT INTO public.profiles (id, first_name, last_name, email)
        VALUES (admin_user_id, 'Admin', 'User', 'admin@darlingtonstore.com')
        ON CONFLICT (id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            email = EXCLUDED.email;
        
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        result_message := 'Admin user already exists and has been configured: ' || admin_user_id::text;
    ELSE
        result_message := 'Admin user does not exist. Please sign up with admin@darlingtonstore.com first.';
    END IF;
    
    RETURN result_message;
END;
$$;

