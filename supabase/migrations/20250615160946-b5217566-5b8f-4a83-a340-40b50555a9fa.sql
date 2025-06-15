
-- Add status to reviews table
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- To be safe, drop constraint if it exists from a previous attempt
ALTER TABLE public.reviews
DROP CONSTRAINT IF EXISTS reviews_status_check;

-- Add check constraint for status values
ALTER TABLE public.reviews
ADD CONSTRAINT reviews_status_check CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update RLS policies for reviews

-- 1. Public users/anonymous can only see 'approved' reviews.
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view approved reviews"
  ON public.reviews
  FOR SELECT
  USING (status = 'approved');

-- 2. Logged-in users can also see their own reviews, regardless of status.
-- This policy combines with the one above. A user sees all approved reviews
-- from everyone, plus all of their own reviews (pending, rejected, etc.).
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.reviews;
CREATE POLICY "Users can view their own reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Admins can manage all reviews. This gives them full access.
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
CREATE POLICY "Admins can manage reviews"
  ON public.reviews
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Users can only update their own reviews if they are still "pending".
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
CREATE POLICY "Users can update their own reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');
