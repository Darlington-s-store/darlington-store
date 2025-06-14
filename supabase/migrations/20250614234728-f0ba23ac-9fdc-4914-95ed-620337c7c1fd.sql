
-- Add foreign key relationship between product_reviews and profiles
-- Since both tables reference auth.users(id), we can create a relationship between them
-- First, let's make sure all existing reviews have corresponding profiles
INSERT INTO public.profiles (id, first_name, last_name)
SELECT DISTINCT pr.user_id, 'Anonymous', 'User'
FROM public.product_reviews pr
WHERE pr.user_id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Now add the foreign key constraint
ALTER TABLE public.product_reviews 
ADD CONSTRAINT fk_product_reviews_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
