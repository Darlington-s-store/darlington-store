
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function ProductGrid() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(4)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: `₵${product.price}`,
      quantity: 1,
      image: product.image_url
    };
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
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
    alert(`Added ${product.name} to cart!`);
  };

  const handleAddToWishlist = (product: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: `₵${product.price}`,
      image: product.image_url,
      brand: product.brand,
      rating: 4.5 // Default rating since we don't have reviews yet
    };

    const existingWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
    const isAlreadyInWishlist = existingWishlist.some((item: any) => item.id === product.id);

    if (isAlreadyInWishlist) {
      alert('Item is already in your wishlist!');
      return;
    }

    const updatedWishlist = [...existingWishlist, wishlistItem];
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
    alert(`Added ${product.name} to wishlist!`);
  };

  if (isLoading) {
    return (
      <section className="w-full py-10 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Most Popular Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg shadow-md border animate-pulse">
                <div className="w-full h-44 bg-gray-300 rounded-t-lg" />
                <div className="px-4 py-3">
                  <div className="h-6 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded mb-2" />
                  <div className="h-6 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded mb-4" />
                  <div className="h-10 bg-gray-300 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Most Popular Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md border hover:shadow-lg transition group flex flex-col justify-between"
            >
              <div className="relative">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-44 object-cover rounded-t-lg cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                />
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                >
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-600" />
                </button>
              </div>
              <div className="flex flex-col px-4 py-3 grow">
                <div className="font-semibold text-lg mb-1">{product.name}</div>
                <div className="text-gray-600 text-sm mb-2">{product.description}</div>
                <div className="flex items-center justify-between mt-auto mb-1">
                  <div className="text-red-700 font-bold text-lg">₵{product.price}</div>
                  <div className="flex items-center text-yellow-500 text-base font-semibold ml-2">
                    <Star className="h-5 w-5 mr-1 fill-yellow-400 stroke-yellow-500" />
                    4.5
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">Brand: {product.brand}</div>
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="bg-red-700 hover:bg-red-800 text-white w-full mt-2 flex items-center justify-center gap-2 text-base font-medium"
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
