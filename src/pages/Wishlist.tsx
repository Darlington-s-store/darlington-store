
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface WishlistItem {
  id: number;
  name: string;
  price: string;
  image: string;
  brand: string;
  rating: number;
}

const Wishlist = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem(`wishlist_${user?.id}`);
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, [user, loading, navigate]);

  const removeFromWishlist = (productId: number) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem(`wishlist_${user?.id}`, JSON.stringify(updatedWishlist));
  };

  const addToCart = (item: WishlistItem) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    };
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex((cartItem: any) => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message
    alert(`Added ${item.name} to cart!`);
  };

  const addToWishlist = (product: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const wishlistItem: WishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      rating: product.rating
    };

    const existingWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
    const isAlreadyInWishlist = existingWishlist.some((item: WishlistItem) => item.id === product.id);

    if (!isAlreadyInWishlist) {
      const updatedWishlist = [...existingWishlist, wishlistItem];
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Items you've saved for later</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Start adding items you love to your wishlist</p>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-red-700 hover:bg-red-800"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition group">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-44 object-cover rounded-t-lg cursor-pointer"
                    onClick={() => navigate(`/product/${item.id}`)}
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 cursor-pointer hover:text-red-700" 
                      onClick={() => navigate(`/product/${item.id}`)}>
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">Brand: {item.brand}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-red-700 font-bold text-lg">{item.price}</span>
                    <div className="flex items-center text-yellow-500">
                      <Heart className="h-4 w-4 mr-1 fill-yellow-400 stroke-yellow-500" />
                      {item.rating}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-red-700 hover:bg-red-800 text-white flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
