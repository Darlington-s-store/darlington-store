
import { useAuth } from "@/hooks/useAuth";
import WishlistGrid from "@/components/wishlist/WishlistGrid";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your wishlist</p>
          <Button onClick={() => navigate('/auth')} className="bg-red-700 hover:bg-red-800">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <WishlistGrid />
    </div>
  );
};

export default Wishlist;
