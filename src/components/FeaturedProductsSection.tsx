
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "./ProductCard";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

interface FeaturedProductsSectionProps {
  title: string;
  subtitle?: string;
  limit?: number;
  featured?: boolean;
  categoryId?: number;
  showViewAll?: boolean;
}

export default function FeaturedProductsSection({
  title,
  subtitle,
  limit = 8,
  featured = false,
  categoryId,
  showViewAll = true
}: FeaturedProductsSectionProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['featured-products', featured, categoryId, limit],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('id, name, description, price, brand, image_url, images, stock_quantity')
        .eq('is_active', true)
        .limit(limit)
        .order('created_at', { ascending: false });

      if (featured) {
        query = query.eq('featured', true);
      }

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleAddToCart = (product: any) => {
    addItem(product);
  };

  const handleAddToWishlist = (product: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      brand: product.brand,
      rating: 4.5
    };

    const existingWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
    const isAlreadyInWishlist = existingWishlist.some((item: any) => item.id === product.id);

    if (isAlreadyInWishlist) {
      alert('Item is already in your wishlist!');
      return;
    }

    const updatedWishlist = [...existingWishlist, wishlistItem];
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
    
    window.dispatchEvent(new Event('wishlistUpdated'));
    alert(`Added ${product.name} to wishlist!`);
  };

  if (isLoading) {
    return (
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md border animate-pulse">
                <div className="w-full h-44 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <button
              onClick={() => navigate('/products')}
              className="flex items-center text-red-600 hover:text-red-700 font-medium"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
