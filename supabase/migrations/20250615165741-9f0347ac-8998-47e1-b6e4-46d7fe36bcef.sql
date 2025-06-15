
-- Add foreign key constraints to the reviews table to link it with users and products.

-- First, let's link reviews to the users who wrote them.
-- To be safe, we'll drop the constraint if it already exists from a previous attempt.
ALTER TABLE public.reviews
DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- Now, add the foreign key constraint. This will also delete a user's reviews if their account is deleted.
ALTER TABLE public.reviews
ADD CONSTRAINT reviews_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Next, let's link reviews to the products they are for.
-- Again, drop the constraint if it exists to avoid errors.
ALTER TABLE public.reviews
DROP CONSTRAINT IF EXISTS reviews_product_id_fkey;

-- Add the foreign key. This will delete a product's reviews if the product is deleted.
ALTER TABLE public.reviews
ADD CONSTRAINT reviews_product_id_fkey
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

