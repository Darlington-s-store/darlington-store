
-- First, let's fix the RLS policies for user_roles table to allow proper access
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create more permissive policies for user_roles
CREATE POLICY "Authenticated users can view user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage all user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Clean up any existing admin user attempts and start fresh
DELETE FROM public.user_roles WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email = 'admin@darlingtonstore.com'
);
DELETE FROM public.profiles WHERE email = 'admin@darlingtonstore.com';

-- Updated admin user setup script that handles existing users properly
DO $$
DECLARE
    admin_user_id uuid;
    profile_exists boolean := false;
    role_exists boolean := false;
BEGIN
    -- Check if admin user already exists in auth.users
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@darlingtonstore.com';
    
    -- If admin user doesn't exist in auth.users, create it
    IF admin_user_id IS NULL THEN
        -- Generate a new UUID for the admin user
        admin_user_id := gen_random_uuid();
        
        -- Insert into auth.users (simplified for development setup)
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_user_meta_data,
            raw_app_meta_data,
            is_super_admin,
            role
        ) VALUES (
            admin_user_id,
            'admin@darlingtonstore.com',
            crypt('admin123', gen_salt('bf')), -- Hash the password
            now(),
            now(),
            now(),
            '{"first_name": "Admin", "last_name": "User"}',
            '{}',
            false,
            'authenticated'
        );
        
        RAISE NOTICE 'Admin user created in auth.users with email: admin@darlingtonstore.com';
    ELSE
        RAISE NOTICE 'Admin user already exists in auth.users: admin@darlingtonstore.com';
    END IF;
    
    -- Check if profile exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = admin_user_id) INTO profile_exists;
    
    -- Insert into profiles table if it doesn't exist
    IF NOT profile_exists THEN
        INSERT INTO public.profiles (id, first_name, last_name, email)
        VALUES (admin_user_id, 'Admin', 'User', 'admin@darlingtonstore.com');
        RAISE NOTICE 'Profile created for admin user';
    ELSE
        RAISE NOTICE 'Profile already exists for admin user';
    END IF;
    
    -- Check if admin role exists
    SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = admin_user_id AND role = 'admin') INTO role_exists;
    
    -- Assign admin role if it doesn't exist
    IF NOT role_exists THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin');
        RAISE NOTICE 'Admin role assigned to user';
    ELSE
        RAISE NOTICE 'User already has admin role';
    END IF;
    
    RAISE NOTICE 'Setup complete! You can now login with: admin@darlingtonstore.com / admin123';
END $$;
