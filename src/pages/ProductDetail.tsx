import { useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Star, Heart, Share2, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
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
  const { user } = useAuth();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [refreshReviews, setRefreshReviews] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      
      const productId = parseInt(id, 10);
      if (isNaN(productId)) throw new Error('Invalid product ID');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories!products_category_id_fkey (
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

  const { data: reviewStats } = useQuery({
    queryKey: ['review-stats', id, refreshReviews],
    queryFn: async () => {
      if (!id) return { averageRating: 0, totalReviews: 0 };
      const productId = parseInt(id, 10);
      if (isNaN(productId)) return { averageRating: 0, totalReviews: 0 };
      
      const { data, error, count } = await supabase
        .from('reviews')
        .select('rating', { count: 'exact' })
        .eq('product_id', productId)
        .eq('status', 'approved');
      
      if (error) {
        console.error("Error fetching review stats:", error);
        return { averageRating: 0, totalReviews: 0 };
      }

      const totalReviews = count || 0;
      if (totalReviews === 0) {
        return { averageRating: 0, totalReviews: 0 };
      }

      const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / totalReviews;
      
      return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: totalReviews
      };
    },
    enabled: !!product,
    initialData: { averageRating: 0, totalReviews: 0 }
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
    addItem(product, quantity);
  };

  const handleAddToWishlist = () => {
    if (!user || !product) {
      alert('Please sign in to add items to your wishlist');
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

  const handleReviewSubmitted = () => {
    setRefreshReviews(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="px-4 py-4">
          <div className="space-y-6">
            <div className="aspect-square bg-gray-300 rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded animate-pulse" />
              <div className="h-4 bg-gray-300 rounded animate-pulse" />
              <div className="h-8 bg-gray-300 rounded animate-pulse" />
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="px-4 py-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

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

  const specifications =
    product.specifications &&
    typeof product.specifications === "object" &&
    !Array.isArray(product.specifications) &&
    product.specifications !== null
      ? (product.specifications as { [key: string]: unknown })
      : {};

  const dimensions =
    product.dimensions &&
    typeof product.dimensions === "object" &&
    !Array.isArray(product.dimensions) &&
    product.dimensions !== null
      ? (product.dimensions as { [key: string]: unknown })
      : {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="px-4 py-4">
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12 lg:max-w-7xl lg:mx-auto">
          <div className="w-full">
            <ImageGallery images={images} productName={product.name} />
          </div>

          <div className="space-y-4 lg:space-y-6">
            <div>
              <p className="text-sm text-red-700 font-medium mb-2">{product.categories?.name}</p>
              <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight break-words hyphens-auto">{product.name}</h1>
              {product.description && <p className="text-gray-600 text-sm lg:text-base leading-relaxed break-words mb-4">{product.description}</p>}
              
              <div className="text-sm text-gray-700 space-y-2 border-t pt-4 mt-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2">Key Features & Specs</h3>
                <ul className="list-none space-y-2">
                  {specifications.package_includes && (
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <div><strong className="text-gray-800">Package Includes:</strong> {String(specifications.package_includes)}</div>
                    </li>
                  )}
                  {(product.name.toLowerCase().includes('usb') || (product.description && product.description.toLowerCase().includes('usb'))) && (
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <div><strong className="text-gray-800">Convenience:</strong> Built-in USB charging port (power bank not included).</div>
                    </li>
                  )}
                  {specifications.material && (
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <div><strong className="text-gray-800">Material:</strong> {String(specifications.material)}</div>
                    </li>
                  )}
                  {specifications.size && (
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <div><strong className="text-gray-800">Fits Laptops:</strong> Up to {String(specifications.size)}</div>
                    </li>
                  )}
                  {product.weight && (
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <div><strong className="text-gray-800">Weight:</strong> {`${product.weight} kg`}</div>
                    </li>
                  )}
                  {dimensions && dimensions.width && dimensions.height && dimensions.depth && (
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <div><strong className="text-gray-800">Dimensions:</strong> {`${dimensions.width}cm x ${dimensions.height}cm x ${dimensions.depth}cm`}</div>
                    </li>
                  )}
                </ul>
                <p className="text-xs text-gray-500 pt-2">For full details, check the Technical Specifications tab.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t">
              <div className="flex items-center">
                <Star className="w-4 h-4 lg:w-5 lg:h-5 fill-yellow-400 stroke-yellow-500" />
                <span className="ml-1 font-semibold text-sm lg:text-base">{reviewStats.averageRating.toFixed(1)}</span>
                <span className="ml-2 text-gray-600 text-xs lg:text-sm">
                  ({reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''})
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Brand: <span className="font-medium text-gray-800">{product.brand || 'Unbranded'}</span>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-2xl lg:text-3xl font-bold text-red-700">₵{product.price}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${product.stock_quantity > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className={`font-medium text-sm lg:text-base ${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : "Out of Stock"}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm lg:text-base">Qty:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="p-2 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center text-sm lg:text-base">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="p-2 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white flex items-center justify-center gap-2 text-sm lg:text-base py-3 lg:py-3 touch-manipulation transition-colors"
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>{product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="p-3 touch-manipulation"
                  onClick={handleAddToWishlist}
                >
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
                <Button variant="outline" size="icon" className="p-3 touch-manipulation">
                  <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-4 border-t lg:grid-cols-3 lg:gap-4 lg:pt-6">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 lg:w-5 lg:h-5 text-red-700" />
                <span className="text-xs lg:text-sm">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-red-700" />
                <span className="text-xs lg:text-sm">2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5 text-red-700" />
                <span className="text-xs lg:text-sm">30 Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mt-6 lg:mt-12 lg:max-w-7xl lg:mx-auto">
          <div className="border-b">
            <nav className="flex px-4 overflow-x-auto scrollbar-hide">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-3 border-b-2 font-medium capitalize text-sm whitespace-nowrap touch-manipulation transition-colors ${
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

          <div className="p-4 lg:p-6">
            {activeTab === "description" && (
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-700 mb-4 text-sm lg:text-base leading-relaxed break-words">{product.description}</p>
                {product.model && (
                  <div className="mb-3 text-sm lg:text-base">
                    <strong>Model:</strong> {product.model}
                  </div>
                )}
                {product.brand && (
                  <div className="mb-3 text-sm lg:text-base">
                    <strong>Brand:</strong> {product.brand}
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Technical Specifications</h3>
                {Object.keys(specifications).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 pb-2">
                        <dt className="font-medium text-gray-900 capitalize text-sm lg:text-base">{key.replace(/_/g, ' ')}</dt>
                        <dd className="text-gray-700 text-sm lg:text-base">{String(value)}</dd>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm lg:text-base">No specifications available for this product.</p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
                  <ReviewsList 
                    productId={product.id} 
                    refreshTrigger={refreshReviews}
                  />
                </div>
                
                <div>
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
