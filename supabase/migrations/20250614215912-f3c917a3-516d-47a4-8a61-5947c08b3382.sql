
-- First, let's check what policies already exist and only create the missing ones

-- Enable Row Level Security on product_reviews (this is safe to run multiple times)
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view product reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.product_reviews;

-- Create policy that allows anyone to view reviews
CREATE POLICY "Anyone can view product reviews" 
  ON public.product_reviews 
  FOR SELECT 
  USING (true);

-- Create policy that allows authenticated users to insert their own reviews
CREATE POLICY "Authenticated users can create reviews" 
  ON public.product_reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own reviews
CREATE POLICY "Users can update their own reviews" 
  ON public.product_reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
  ON public.product_reviews 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add constraint to ensure rating is between 1 and 5 (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE constraint_name = 'rating_range' 
        AND table_name = 'product_reviews'
    ) THEN
        ALTER TABLE public.product_reviews 
        ADD CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5);
    END IF;
END $$;
