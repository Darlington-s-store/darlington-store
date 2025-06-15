
-- First, let's clean up any existing admin user data
DELETE FROM public.user_roles WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email = 'admin@darlingtonstore.com'
);
DELETE FROM public.profiles WHERE email = 'admin@darlingtonstore.com';

-- Remove the invalid auth.users entry (this won't work anyway)
-- We can't directly delete from auth.users, so we'll let Supabase handle user creation

-- Create a function to set up admin user after they sign up
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
