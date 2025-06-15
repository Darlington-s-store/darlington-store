
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import ProductCard from "../components/ProductCard";
import { supabase } from "@/integrations/supabase/client";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      console.log('Categories fetched:', data);
      return data || [];
    }
  });

  // Fetch products with enhanced debugging
  const { data: allProducts = [], isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products...');
      
      let query = supabase
        .from('products')
        .select(`
          *,
          categories!products_category_id_fkey (
            name
          )
        `)
        .eq('is_active', true);

      console.log('Base query with is_active = true');

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Products fetched:', data?.length, 'products');
      console.log('Sample product:', data?.[0]);
      
      // Log products with multiple images for debugging
      data?.forEach(product => {
        if (product.images && Array.isArray(product.images) && product.images.length > 1) {
          console.log(`Product ${product.id} (${product.name}) has ${product.images.length} images:`, product.images);
        }
      });
      
      return data || [];
    },
    // Add refetch interval to check for updates
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Filter products on the client side with proper null safety
  const products = allProducts.filter((product) => {
    // Ensure product exists
    if (!product) return false;

    // Category filter with enhanced null safety
    if (selectedCategory !== "All" && categories && categories.length > 0) {
      const category = categories.find(cat => cat && cat.name === selectedCategory);
      if (category && product.category_id !== category.id) {
        return false;
      }
    }

    // Search filter with comprehensive null safety
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const name = (product.name || '').toString();
      const description = (product.description || '').toString();
      const brand = (product.brand || '').toString();
      
      const matchesSearch = 
        name.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower) ||
        brand.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });

  // Listen for real-time product updates with enhanced logging
  useEffect(() => {
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Product change detected:', payload);
          console.log('Triggering refetch...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Force refetch when page becomes visible (helps with caching issues)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refetching products...');
        refetch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refetch]);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
    
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  // Ensure categories exist and have valid names before creating options
  const categoryOptions = ["All", ...(categories || []).filter(cat => cat && cat.name).map(cat => cat.name)];

  const handleCategoryChange = (category: string) => {
    console.log('Category changed to:', category);
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (search: string) => {
    console.log('Search changed to:', search);
    setSearchTerm(search);
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: `₵${product.price}`,
      quantity: 1,
      image: product.image_url
    };
    
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`Added ${product.name} to cart!`);
  };

  const handleAddToWishlist = (product: any) => {
    alert('Please sign in to add items to your wishlist');
  };

  // Enhanced debug information
  console.log('Products page state:', {
    isLoading,
    allProductsCount: allProducts?.length,
    filteredProductsCount: products?.length,
    categoriesCount: categories?.length,
    selectedCategory,
    searchTerm,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          
          {/* Debug panel - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mb-4 text-xs">
              <strong>Debug:</strong> {allProducts.length} total products, {products.length} filtered | 
              Last fetch: {new Date().toLocaleTimeString()} | 
              <button 
                onClick={() => refetch()} 
                className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
              >
                Force Refresh
              </button>
            </div>
          )}
          
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-600" size={20} />
              <span className="text-gray-600 font-medium">Category:</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-red-700 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
        ) : (
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
        )}

        {!isLoading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            {searchTerm && (
              <button 
                onClick={() => handleSearchChange("")}
                className="mt-4 text-red-700 hover:text-red-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Products;
