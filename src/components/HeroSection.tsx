
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, Star, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { settings } = useAppSettings();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured products for hero section
  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['hero-featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, images, brand, stock_quantity')
        .eq('is_active', true)
        .eq('featured', true)
        .limit(4);
      
      if (error) {
        console.error('Error fetching featured products:', error);
        return [];
      }
      
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  // Create slides from featured products or use fallback
  const slides = featuredProducts.length > 0 ? featuredProducts.map((product, index) => {
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
      return [];
    };

    const productImages = parseImages(product.images);
    const mainImage = productImages.length > 0 ? productImages[0] : product.image_url;

    const gradients = [
      "from-blue-600 to-purple-700",
      "from-gray-600 to-gray-800", 
      "from-purple-600 to-pink-600",
      "from-red-600 to-orange-600"
    ];

    return {
      id: product.id,
      title: product.name,
      subtitle: product.brand || "Premium Quality",
      description: product.description || "Experience excellence with our premium products",
      price: `₵${product.price.toLocaleString()}`,
      image: mainImage,
      gradient: gradients[index % gradients.length],
      productId: product.id,
      stockQuantity: product.stock_quantity || 0
    };
  }) : [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      subtitle: "Titanium. So strong. So light. So Pro.",
      description: "Experience the power of A17 Pro chip with advanced camera system",
      price: "₵8,999",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      gradient: "from-blue-600 to-purple-700",
      productId: null,
      stockQuantity: 10
    },
    {
      id: 2,
      title: "MacBook Air M3",
      subtitle: "Supercharged by M3 chip",
      description: "Ultra-thin, incredibly powerful, with all-day battery life",
      price: "₵6,999",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
      gradient: "from-gray-600 to-gray-800",
      productId: null,
      stockQuantity: 5
    },
    {
      id: 3,
      title: "Samsung Galaxy S24 Ultra",
      subtitle: "Galaxy AI is here",
      description: "Premium Android experience with S Pen and 200MP camera",
      price: "₵7,499",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
      gradient: "from-purple-600 to-pink-600",
      productId: null,
      stockQuantity: 8
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlideData = slides[currentSlide];

  const handleShopNow = () => {
    if (currentSlideData.productId) {
      navigate(`/product/${currentSlideData.productId}`);
    } else {
      navigate('/products');
    }
  };

  const handleQuickAddToCart = () => {
    if (!currentSlideData.productId) {
      toast.error('Product not available for purchase');
      return;
    }

    const product = featuredProducts.find(p => p.id === currentSlideData.productId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    if (product.stock_quantity <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    addItem(product, 1);
    toast.success(`Added ${product.name} to cart`);
  };

  const handleAddToWishlist = () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!currentSlideData.productId) {
      toast.error('Product not available');
      return;
    }

    const product = featuredProducts.find(p => p.id === currentSlideData.productId);
    if (!product) {
      toast.error('Product not found');
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
      toast.error('Item is already in your wishlist!');
      return;
    }

    const updatedWishlist = [...existingWishlist, wishlistItem];
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
    
    window.dispatchEvent(new Event('wishlistUpdated'));
    toast.success(`Added ${product.name} to wishlist!`);
  };

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentSlideData.image}
          alt={currentSlideData.title}
          className="w-full h-full object-cover opacity-30"
          loading="eager"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.gradient} opacity-80`} />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2 md:p-3 rounded-full transition-all duration-300"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2 md:p-3 rounded-full transition-all duration-300"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Text Content - Enhanced Mobile Layout */}
            <div className="text-white space-y-3 md:space-y-4 order-2 lg:order-1">
              {/* Mobile-optimized product info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                    {currentSlideData.subtitle}
                  </Badge>
                  {currentSlideData.stockQuantity > 0 && (
                    <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                      In Stock
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-white drop-shadow-lg">
                  {currentSlideData.title}
                </h1>
                
                {/* Enhanced Price Display */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span className="text-2xl md:text-3xl font-bold text-yellow-400 drop-shadow-lg">
                    {currentSlideData.price}
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400 drop-shadow" />
                    ))}
                    <span className="text-white/90 ml-2 text-sm md:text-base">(4.8)</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm md:text-lg text-white/90 max-w-lg line-clamp-2 drop-shadow">
                {currentSlideData.description}
              </p>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  size="lg"
                  className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleShopNow}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Shop Now
                </Button>
                
                {currentSlideData.productId && (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 text-base font-semibold backdrop-blur-sm transition-all duration-300"
                      onClick={handleQuickAddToCart}
                      disabled={currentSlideData.stockQuantity <= 0}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-4 py-3 backdrop-blur-sm transition-all duration-300"
                      onClick={handleAddToWishlist}
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Product Image - Enhanced Mobile Visibility */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 lg:w-full lg:max-w-lg">
                <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm shadow-2xl" />
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className="relative z-10 w-full h-full object-contain rounded-2xl p-4 drop-shadow-2xl"
                  loading="eager"
                />
                {/* Product Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-red-700 text-white font-semibold px-3 py-1 shadow-lg">
                    Featured
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125 shadow-lg'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Mobile Stock Indicator */}
      <div className="absolute bottom-16 left-4 right-4 z-10 md:hidden">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-center">
          <p className="text-white text-sm">
            {currentSlideData.stockQuantity > 0 
              ? `${currentSlideData.stockQuantity} items in stock`
              : 'Out of stock'
            }
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
