
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ReviewsListProps {
  productId: number;
  refreshTrigger: number;
}

const ReviewsList = ({ productId, refreshTrigger }: ReviewsListProps) => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['product-reviews', productId, refreshTrigger],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          profiles (
            first_name,
            last_name
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: reviewStats } = useQuery({
    queryKey: ['product-review-stats', productId, refreshTrigger],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_id', productId);
      
      if (error) throw error;
      
      if (data.length === 0) {
        return { averageRating: 0, totalReviews: 0 };
      }

      const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / data.length;
      
      return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: data.length
      };
    }
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 stroke-yellow-500"
                : "stroke-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded animate-pulse w-1/3" />
              <div className="h-4 bg-gray-300 rounded animate-pulse w-1/4" />
              <div className="h-16 bg-gray-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      {reviewStats && reviewStats.totalReviews > 0 && (
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(reviewStats.averageRating))}
              <span className="text-lg font-semibold">{reviewStats.averageRating}</span>
            </div>
            <span className="text-gray-600">
              ({reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''})
            </span>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(review.rating)}
                    <span className="font-medium text-gray-900">
                      {review.profiles?.first_name} {review.profiles?.last_name}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
