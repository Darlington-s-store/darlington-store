import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";

interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  filterCondition?: Record<string, any>;
  limit?: number;
  gradient?: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  brand: string | null;
  model: string | null;
  category_id: number | null;
  stock_quantity: number | null;
  is_active: boolean | null;
  image_url: string | null;
  images: any;
  sku: string | null;
  weight: number | null;
  featured: boolean | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProductShowcase({ 
  title, 
  subtitle, 
  icon: Icon, 
  filterCondition = {}, 
  limit = 8,
  gradient = "from-red-600 to-red-700"
}: ProductShowcaseProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', title, filterCondition],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          brand,
          model,
          category_id,
          stock_quantity,
          is_active,
          image_url,
          images,
          sku,
          weight,
          featured,
          status,
          created_at,
          updated_at
        `)
        .eq('is_active', true)
        .limit(limit)
        .order('created_at', { ascending: false });

      // Apply additional filters
      Object.entries(filterCondition).forEach(([key, value]) => {
        if (key && value !== undefined) {
          query = query.eq(key, value);
        }
      });
      
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      return (data as Product[]) || [];
    }
  });

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const handleAddToWishlist = (product: Product) => {
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
      <section className="w-full py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-2xl" />
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                  <div className="h-6 bg-gray-200 rounded mb-3" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`p-2 bg-gradient-to-r ${gradient} rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={() => navigate('/products')}
            className="hidden md:flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
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
        
        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
