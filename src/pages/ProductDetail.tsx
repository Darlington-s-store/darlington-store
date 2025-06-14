
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Star, Heart, Share2, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import ImageGallery from "../components/ImageGallery";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [refreshReviews, setRefreshReviews] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      
      // Convert string ID to number for the database query
      const productId = parseInt(id, 10);
      if (isNaN(productId)) throw new Error('Invalid product ID');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('id', productId)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase" && quantity < (product?.stock_quantity || 0)) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: `₵${product.price}`,
      quantity: quantity,
      image: product.image_url
    };
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  const handleReviewSubmitted = () => {
    setRefreshReviews(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <Header />
        <main className="w-full max-w-7xl mx-auto px-4 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-12">
            <div className="w-full">
              <div className="aspect-square bg-gray-300 rounded-lg animate-pulse" />
            </div>
            <div className="w-full space-y-6">
              <div className="h-8 bg-gray-300 rounded animate-pulse" />
              <div className="h-6 bg-gray-300 rounded animate-pulse" />
              <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2" />
              <div className="h-12 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <Header />
        <main className="w-full max-w-7xl mx-auto px-4 py-4 md:py-8 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  // Parse images from JSON array or use single image, with proper type handling
  const parseImages = (images: any): string[] => {
    if (Array.isArray(images)) {
      return images.map(img => String(img)).filter(img => img && img.trim() !== '');
    }
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed.map(img => String(img)).filter(img => img && img.trim() !== '') : [product.image_url].filter(Boolean);
      } catch {
        return [product.image_url].filter(Boolean);
      }
    }
    return [product.image_url].filter(Boolean);
  };

  const images = parseImages(product.images);
  const specifications = product.specifications || {};

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <main className="w-full max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-12">
          {/* Product Images */}
          <div className="w-full min-w-0">
            <ImageGallery images={images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="w-full min-w-0 space-y-4 md:space-y-6">
            <div className="w-full">
              <p className="text-sm text-red-700 font-medium mb-2 break-words">{product.categories?.name}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">{product.name}</h1>
              <p className="text-gray-600 text-base md:text-lg break-words">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
              <div className="flex items-center flex-shrink-0">
                <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-500" />
                <span className="ml-1 font-semibold">4.5</span>
                <span className="ml-2 text-gray-600 text-sm">(No reviews yet)</span>
              </div>
              <span className="text-gray-600 text-sm break-words">Brand: {product.brand}</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 w-full">
              <span className="text-2xl md:text-3xl font-bold text-red-700">₵{product.price}</span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 w-full">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${product.stock_quantity > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className={`font-medium text-sm md:text-base break-words ${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="w-full space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-medium text-sm md:text-base flex-shrink-0">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg flex-shrink-0">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="p-2 hover:bg-gray-100 touch-manipulation"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="p-2 hover:bg-gray-100 touch-manipulation"
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 md:gap-4 w-full">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 min-w-0 bg-red-700 hover:bg-red-800 text-white flex items-center justify-center gap-2 text-sm md:text-base py-2 md:py-3 touch-manipulation"
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="truncate">{product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </Button>
                <Button variant="outline" size="icon" className="flex-shrink-0 touch-manipulation">
                  <Heart className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <Button variant="outline" size="icon" className="flex-shrink-0 touch-manipulation">
                  <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t w-full">
              <div className="flex items-center gap-2 min-w-0">
                <Truck className="w-5 h-5 text-red-700 flex-shrink-0" />
                <span className="text-sm truncate">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Shield className="w-5 h-5 text-red-700 flex-shrink-0" />
                <span className="text-sm truncate">2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <RotateCcw className="w-5 h-5 text-red-700 flex-shrink-0" />
                <span className="text-sm truncate">30 Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-md w-full overflow-hidden">
          <div className="border-b overflow-hidden">
            <nav className="flex gap-4 md:gap-8 px-4 md:px-6 overflow-x-auto scrollbar-hide">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium capitalize text-sm md:text-base whitespace-nowrap flex-shrink-0 touch-manipulation ${
                    activeTab === tab
                      ? "border-red-700 text-red-700"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 md:p-6 w-full overflow-hidden">
            {activeTab === "description" && (
              <div className="w-full">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-700 mb-6 text-sm md:text-base break-words">{product.description}</p>
                {product.model && (
                  <div className="mb-4 text-sm md:text-base break-words">
                    <strong>Model:</strong> {product.model}
                  </div>
                )}
                {product.brand && (
                  <div className="mb-4 text-sm md:text-base break-words">
                    <strong>Brand:</strong> {product.brand}
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="w-full">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Technical Specifications</h3>
                {Object.keys(specifications).length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 pb-2 w-full min-w-0">
                        <dt className="font-medium text-gray-900 capitalize text-sm md:text-base break-words">{key.replace(/_/g, ' ')}</dt>
                        <dd className="text-gray-700 text-sm md:text-base break-words">{String(value)}</dd>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm md:text-base">No specifications available for this product.</p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6 md:space-y-8 w-full">
                <div className="w-full">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
                  <ReviewsList 
                    productId={product.id} 
                    refreshTrigger={refreshReviews}
                  />
                </div>
                
                <div className="w-full">
                  <ReviewForm 
                    productId={product.id}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;
