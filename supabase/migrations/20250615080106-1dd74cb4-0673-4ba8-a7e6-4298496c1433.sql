
-- Create reviews table with proper relationships
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id integer REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  verified_purchase boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own reviews" 
  ON public.reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create helpful votes table for review helpfulness
CREATE TABLE IF NOT EXISTS public.review_helpful_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id uuid REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Enable RLS on helpful votes
ALTER TABLE public.review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for helpful votes
CREATE POLICY "Users can view all helpful votes" 
  ON public.review_helpful_votes 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create helpful votes" 
  ON public.review_helpful_votes 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own helpful votes" 
  ON public.review_helpful_votes 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_review_helpful_votes_review_id ON public.review_helpful_votes(review_id);

-- Function to update helpful count when votes are added/removed
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.reviews 
    SET helpful_count = helpful_count + 1 
    WHERE id = NEW.review_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.reviews 
    SET helpful_count = helpful_count - 1 
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for helpful count updates
CREATE TRIGGER trigger_update_helpful_count_insert
  AFTER INSERT ON public.review_helpful_votes
  FOR EACH ROW EXECUTE FUNCTION update_review_helpful_count();

CREATE TRIGGER trigger_update_helpful_count_delete
  AFTER DELETE ON public.review_helpful_votes
  FOR EACH ROW EXECUTE FUNCTION update_review_helpful_count();

-- Add address fields to profiles table for better user management
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address_line_1 text,
ADD COLUMN IF NOT EXISTS address_line_2 text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS country text DEFAULT 'Ghana',
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));

-- Create a view for user statistics
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.email,
  COALESCE(order_count.count, 0) as total_orders,
  COALESCE(order_total.amount, 0) as total_spent,
  COALESCE(review_count.count, 0) as total_reviews,
  COALESCE(avg_rating.rating, 0) as average_rating_given
FROM public.profiles p
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM public.orders 
  WHERE payment_status = 'completed' 
  GROUP BY user_id
) order_count ON p.id = order_count.user_id
LEFT JOIN (
  SELECT user_id, SUM(total_amount) as amount 
  FROM public.orders 
  WHERE payment_status = 'completed' 
  GROUP BY user_id
) order_total ON p.id = order_total.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM public.reviews 
  GROUP BY user_id
) review_count ON p.id = review_count.user_id
LEFT JOIN (
  SELECT user_id, AVG(rating::numeric) as rating 
  FROM public.reviews 
  GROUP BY user_id
) avg_rating ON p.id = avg_rating.user_id;

-- Update the existing product_reviews table to use the new reviews table
-- First, migrate existing data if any
INSERT INTO public.reviews (user_id, product_id, rating, title, comment, created_at, updated_at)
SELECT user_id, product_id, rating, title, comment, created_at, updated_at
FROM public.product_reviews
ON CONFLICT (user_id, product_id) DO NOTHING;
