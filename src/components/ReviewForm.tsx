
import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted: () => void;
}

const ReviewForm = ({ productId, onReviewSubmitted }: ReviewFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a review",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting review:', {
        product_id: productId,
        user_id: user.id,
        rating,
        title: title.trim() || null,
        comment: comment.trim() || null
      });

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          title: title.trim() || null,
          comment: comment.trim() || null,
          verified_purchase: false,
          status: 'pending' // Explicitly set status
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting review:', error);
        
        // Provide more specific error messages
        if (error.code === '23505') {
          toast({
            title: "Duplicate Review",
            description: "You have already reviewed this product.",
            variant: "destructive"
          });
        } else if (error.code === '42501') {
          toast({
            title: "Permission Denied",
            description: "You don't have permission to submit reviews. Please ensure you're logged in.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to submit review. Please try again.",
            variant: "destructive"
          });
        }
        return;
      }

      console.log('Review submitted successfully:', data);

      // Reset form
      setRating(0);
      setTitle("");
      setComment("");
      onReviewSubmitted();
      
      toast({
        title: "Success",
        description: "Review submitted successfully! It will be reviewed before being published."
      });
    } catch (err) {
      console.error('Unexpected error submitting review:', err);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-600 text-center">Please sign in to leave a review</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold">Write a Review</h3>
      
      <div>
        <Label htmlFor="rating">Rating</Label>
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 stroke-yellow-500"
                    : "stroke-gray-300"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {rating} star{rating !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="title">Review Title (Optional)</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your review"
          maxLength={100}
        />
      </div>

      <div>
        <Label htmlFor="comment">Review (Optional)</Label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell others about your experience with this product"
          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none resize-vertical"
          maxLength={500}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full bg-red-700 hover:bg-red-800"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export default ReviewForm;
