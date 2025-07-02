
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured products for hero section
  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['hero-featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, images, brand')
        .eq('is_active', true)
        .eq('featured', true)
        .limit(4);
      
      if (error) {
        console.error('Error fetching featured products:', error);
        return [];
      }
      
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
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
      price: `₵${product.price}`,
      image: mainImage,
      gradient: gradients[index % gradients.length],
      productId: product.id
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
      productId: null
    },
    {
      id: 2,
      title: "MacBook Air M3",
      subtitle: "Supercharged by M3 chip",
      description: "Ultra-thin, incredibly powerful, with all-day battery life",
      price: "₵6,999",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
      gradient: "from-gray-600 to-gray-800",
      productId: null
    },
    {
      id: 3,
      title: "Samsung Galaxy S24 Ultra",
      subtitle: "Galaxy AI is here",
      description: "Premium Android experience with S Pen and 200MP camera",
      price: "₵7,499",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
      gradient: "from-purple-600 to-pink-600",
      productId: null
    },
    {
      id: 4,
      title: "Latest Gaming Collection",
      subtitle: "PlayStation 5 & Xbox Series X",
      description: "Next-gen gaming with incredible graphics and performance",
      price: "From ₵3,799",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
      gradient: "from-red-600 to-orange-600",
      productId: null
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

  return (
    <section className="relative h-[500px] md:h-[700px] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
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
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="text-white space-y-4 md:space-y-6">
              <div className="space-y-2">
                <p className="text-sm md:text-lg lg:text-xl font-medium text-white/90">
                  {currentSlideData.subtitle}
                </p>
                <h1 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  {currentSlideData.title}
                </h1>
              </div>
              
              <p className="text-sm md:text-lg lg:text-xl text-white/80 max-w-lg">
                {currentSlideData.description}
              </p>

              <div className="flex items-center space-x-4">
                <span className="text-xl md:text-3xl lg:text-4xl font-bold text-yellow-400">
                  {currentSlideData.price}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-white/80 ml-2 text-sm md:text-base">(4.8)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                <Button
                  size="lg"
                  className="bg-red-700 hover:bg-red-800 text-white px-6 md:px-8 py-2 md:py-3 text-sm md:text-lg font-semibold"
                  onClick={handleShopNow}
                >
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900 px-6 md:px-8 py-2 md:py-3 text-sm md:text-lg font-semibold"
                  onClick={() => navigate('/products')}
                >
                  View All Products
                </Button>
              </div>
            </div>

            {/* Product Image - Enhanced for mobile */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xs md:max-w-md">
                <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm" />
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className="relative z-10 w-full h-auto object-contain rounded-2xl"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Stats Banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
            <div>
              <div className="text-lg md:text-2xl font-bold">500+</div>
              <div className="text-xs md:text-sm opacity-80">Products</div>
            </div>
            <div>
              <div className="text-lg md:text-2xl font-bold">50+</div>
              <div className="text-xs md:text-sm opacity-80">Brands</div>
            </div>
            <div>
              <div className="text-lg md:text-2xl font-bold">24/7</div>
              <div className="text-xs md:text-sm opacity-80">Support</div>
            </div>
            <div>
              <div className="text-lg md:text-2xl font-bold">2 Years</div>
              <div className="text-xs md:text-sm opacity-80">Warranty</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
