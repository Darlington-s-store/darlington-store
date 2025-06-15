
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trash2, ShieldQuestion } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Review {
  id: string;
  created_at: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: 'pending' | 'approved' | 'rejected';
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
  products: {
    name: string;
  } | null;
}

const AdminReviewManager = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id, created_at, rating, title, comment, status,
          profiles ( first_name, last_name, email ),
          products ( name )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data as any[]);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', reviewId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Review has been ${status}.`
      });
      fetchReviews();
    } catch (error) {
      console.error(`Error updating review status to ${status}:`, error);
      toast({
        title: "Error",
        description: "Failed to update review status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Review has been deleted.",
      });
      fetchReviews();
    } catch(error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Review['status']) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
        <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
        </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Management</CardTitle>
        <CardDescription>Approve, reject, or delete user-submitted reviews.</CardDescription>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="p-8 text-center">
              <ShieldQuestion className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-600 mt-2">No reviews found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="font-medium">{review.profiles?.first_name} {review.profiles?.last_name || ''}</div>
                      <div className="text-sm text-gray-500">{review.profiles?.email}</div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{review.products?.name || 'N/A'}</TableCell>
                    <TableCell>{review.rating} / 5</TableCell>
                    <TableCell>
                      <div className="font-medium max-w-[200px] truncate">{review.title}</div>
                      <p className="text-sm text-gray-600 max-w-[200px] truncate">{review.comment}</p>
                    </TableCell>
                    <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        {review.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(review.id, 'approved')}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(review.id, 'rejected')}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this review. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminReviewManager;
