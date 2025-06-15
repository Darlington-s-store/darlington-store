
import { useAuth } from "@/hooks/useAuth";
import WishlistGrid from "@/components/wishlist/WishlistGrid";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-32 md:pt-20">
        {user ? (
          <WishlistGrid />
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
            <p className="text-gray-600 mb-6">Please sign in to view your wishlist</p>
            <Button onClick={() => navigate('/auth')} className="bg-red-700 hover:bg-red-800">
              Sign In
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
