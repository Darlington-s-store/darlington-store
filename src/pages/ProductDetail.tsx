
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Minus, Plus, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import ImageGallery from "@/components/ImageGallery";
import ProductColorSelector from "@/components/product/ProductColorSelector";
import ProductSpecifications from "@/components/product/ProductSpecifications";
import ReviewsList from "@/components/ReviewsList";
import ReviewForm from "@/components/ReviewForm";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('space-gray');

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const parseImages = (images: any): string[] => {
    if (Array.isArray(images)) {
      return images.filter(img => img && img.trim() !== '');
    }
    
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed.filter(img => img && img.trim() !== '') : [];
      } catch {
        return [];
      }
    }
    
    return product?.image_url ? [product.image_url] : [];
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      ...product,
      selectedColor,
      quantity
    };
    
    addItem(cartItem, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleAddToWishlist = () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!product) return;

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
      toast.error('Item is already in your wishlist!');
      return;
    }

    const updatedWishlist = [...existingWishlist, wishlistItem];
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
    
    window.dispatchEvent(new Event('wishlistUpdated'));
    toast.success(`Added ${product.name} to wishlist!`);
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32 md:pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32 md:pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/products')}>
              Browse All Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = parseImages(product.images);
  const isInStock = (product.stock_quantity || 0) > 0;
  const maxQuantity = Math.min(product.stock_quantity || 0, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32 md:pt-24">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <ImageGallery 
              images={images.length > 0 ? images : [product.image_url].filter(Boolean)}
              productName={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.5)</span>
                </div>
                <Badge variant="secondary">
                  {product.brand || 'Unbranded'}
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-red-700">
                ₵{product.price.toLocaleString()}
              </span>
              {product.featured && (
                <Badge variant="destructive">Featured</Badge>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Color Selection */}
            <ProductColorSelector
              colors={[
                { name: "Space Gray", value: "space-gray", hex: "#8E8E93" },
                { name: "Silver", value: "silver", hex: "#C0C0C0" },
                { name: "Gold", value: "gold", hex: "#FFD700" },
                { name: "Blue", value: "blue", hex: "#007AFF" }
              ]}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
            />

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                {isInStock ? `${product.stock_quantity} in stock` : 'Out of stock'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="flex-1 bg-red-700 hover:bg-red-800"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddToWishlist}
                  className="border-red-700 text-red-700 hover:bg-red-50"
                >
                  <Heart className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <RotateCcw className="w-4 h-4" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mb-12">
          <ProductSpecifications
            specifications={product.specifications || {}}
            brand={product.brand}
            weight={product.weight}
            dimensions={product.dimensions || {}}
          />
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ReviewsList productId={product.id} />
          </div>
          <div>
            {user ? (
              <ReviewForm productId={product.id} />
            ) : (
              <div className="text-center p-8 bg-gray-100 rounded-lg">
                <p className="text-gray-600 mb-4">Sign in to leave a review</p>
                <Button onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
