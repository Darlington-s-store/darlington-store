
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
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', selectedCategory, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('is_active', true);

      // Filter by category if not "All"
      if (selectedCategory !== "All") {
        const category = categories.find(cat => cat.name === selectedCategory);
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      // Search filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%, brand.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: categories.length > 0
  });

  // Update products with proper images
  useEffect(() => {
    const updateProductImages = async () => {
      console.log('Updating product images...');
      
      const productUpdates = [
        // Smartphones
        {
          name: "iPhone 14 Pro Max",
          images: [
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
            "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500"
          ],
          image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
        },
        {
          name: "Samsung Galaxy S23 Ultra",
          images: [
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
            "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
          ],
          image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500"
        },
        // Laptops
        {
          name: "MacBook Pro 16-inch M2",
          images: [
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
            "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500"
          ],
          image_url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"
        },
        {
          name: "Dell XPS 13",
          images: [
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500",
            "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500",
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500"
          ],
          image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500"
        },
        // Tablets
        {
          name: "iPad Air 5th Generation",
          images: [
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
            "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500",
            "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500"
          ],
          image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"
        },
        {
          name: "Samsung Galaxy Tab S8",
          images: [
            "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=500",
            "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=500",
            "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500"
          ],
          image_url: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=500"
        },
        // Headphones
        {
          name: "Sony WH-1000XM4",
          images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
            "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
          ],
          image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
        },
        {
          name: "Apple AirPods Pro 2nd Generation",
          images: [
            "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500",
            "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
          ],
          image_url: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500"
        },
        // Gaming
        {
          name: "PlayStation 5",
          images: [
            "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
            "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500"
          ],
          image_url: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500"
        },
        {
          name: "Xbox Series X",
          images: [
            "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500"
          ],
          image_url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500"
        },
        // Accessories
        {
          name: "Anker PowerCore 10000",
          images: [
            "/lovable-uploads/01f5dee9-0b3f-4b4e-aaa8-dc52b099224b.png",
            "/lovable-uploads/7191890f-99d1-4b4c-9662-dbad1c7a405d.png",
            "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500"
          ],
          image_url: "/lovable-uploads/01f5dee9-0b3f-4b4e-aaa8-dc52b099224b.png"
        },
        {
          name: "Logitech MX Master 3",
          images: [
            "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
            "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
            "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500"
          ],
          image_url: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500"
        }
      ];

      for (const update of productUpdates) {
        try {
          const { error } = await supabase
            .from('products')
            .update({
              images: update.images,
              image_url: update.image_url
            })
            .eq('name', update.name);

          if (error) {
            console.error(`Error updating ${update.name}:`, error);
          } else {
            console.log(`Successfully updated ${update.name} with images`);
          }
        } catch (err) {
          console.error(`Error updating ${update.name}:`, err);
        }
      }
    };

    if (products.length > 0) {
      updateProductImages();
    }
  }, [products.length]);

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

  const categoryOptions = ["All", ...categories.map(cat => cat.name)];

  const handleCategoryChange = (category: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          
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
