
-- First, let's ensure the RLS policies are set up correctly for user_roles
-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Authenticated users can view user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create more permissive policies that allow proper access
CREATE POLICY "Allow authenticated users to read user_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert their own roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

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
