
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "../ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

const CategoryProductSearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  // Fetch categories with their products
  const { data: categoriesWithProducts = [], isLoading } = useQuery({
    queryKey: ['categories-with-products'],
    queryFn: async () => {
      // Fetch categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, image_url')
        .eq('is_active', true)
        .order('name');
      
      if (categoriesError) throw categoriesError;

      // Fetch products for each category
      const categoriesWithProducts = await Promise.all(
        categories.map(async (category) => {
          const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name, description, price, brand, image_url, images, stock_quantity')
            .eq('is_active', true)
            .eq('category_id', category.id)
            .limit(8)
            .order('created_at', { ascending: false });
          
          if (productsError) {
            console.error(`Error fetching products for category ${category.id}:`, productsError);
            return { ...category, products: [] };
          }

          return {
            ...category,
            products: products || [],
            productCount: products?.length || 0
          };
        })
      );

      // Filter out categories with no products
      return categoriesWithProducts.filter(category => category.products.length > 0);
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
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="bg-white rounded-2xl shadow-sm border animate-pulse">
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
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categoriesWithProducts.map((category) => (
        <Card key={category.id} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {category.image_url && (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <CardTitle className="text-2xl text-gray-900">{category.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {category.productCount} products
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => navigate(`/products?category=${category.name}`)}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                View All →
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CategoryProductSearch;
