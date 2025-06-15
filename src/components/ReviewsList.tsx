
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ReviewsListProps {
  productId: number;
  refreshTrigger: number;
}

const ReviewsList = ({ productId, refreshTrigger }: ReviewsListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [votingReviewId, setVotingReviewId] = useState<string | null>(null);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', productId, refreshTrigger],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
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

  const { data: userVotes = [] } = useQuery({
    queryKey: ['user-helpful-votes', productId, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('review_helpful_votes')
        .select('review_id')
        .eq('user_id', user.id)
        .in('review_id', reviews.map(r => r.id));
      
      if (error) throw error;
      return data.map(v => v.review_id);
    },
    enabled: !!user && reviews.length > 0
  });

  const { data: reviewStats } = useQuery({
    queryKey: ['review-stats', productId, refreshTrigger],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
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

  const handleHelpfulVote = async (reviewId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to vote on reviews",
        variant: "destructive"
      });
      return;
    }

    setVotingReviewId(reviewId);

    try {
      const hasVoted = userVotes.includes(reviewId);

      if (hasVoted) {
        // Remove vote
        const { error } = await supabase
          .from('review_helpful_votes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        toast({
          title: "Vote Removed",
          description: "Your helpful vote has been removed"
        });
      } else {
        // Add vote
        const { error } = await supabase
          .from('review_helpful_votes')
          .insert({
            review_id: reviewId,
            user_id: user.id
          });

        if (error) throw error;
        
        toast({
          title: "Vote Added",
          description: "Thank you for marking this review as helpful!"
        });
      }

      // Refresh queries to update the UI
      window.location.reload();

    } catch (error) {
      console.error('Error voting on review:', error);
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setVotingReviewId(null);
    }
  };

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
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(review.rating)}
                    <span className="font-medium text-gray-900">
                      {review.profiles?.first_name} {review.profiles?.last_name}
                    </span>
                    {review.verified_purchase && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
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
                <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
              )}

              {/* Helpful voting */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHelpfulVote(review.id)}
                  disabled={votingReviewId === review.id}
                  className={`flex items-center gap-1 ${
                    userVotes.includes(review.id) ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpful_count})
                </Button>
                <span className="text-sm text-gray-500">
                  Was this review helpful?
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
