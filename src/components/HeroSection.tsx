
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
    <section className="relative h-[400px] md:h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center">
            {/* Text Content */}
            <div className="text-white space-y-2 md:space-y-4">
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-lg font-medium text-white/90">
                  {currentSlideData.subtitle}
                </p>
                <h1 className="text-xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {currentSlideData.title}
                </h1>
              </div>
              
              <p className="text-xs md:text-lg text-white/80 max-w-lg line-clamp-2">
                {currentSlideData.description}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4">
                <span className="text-lg md:text-3xl font-bold text-yellow-400">
                  {currentSlideData.price}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-white/80 ml-1 text-xs md:text-sm">(4.8)</span>
                </div>
              </div>

              <div className="pt-2 md:pt-4">
                <Button
                  size="sm"
                  className="bg-red-700 hover:bg-red-800 text-white px-4 md:px-6 py-2 text-sm md:text-base font-semibold"
                  onClick={handleShopNow}
                >
                  <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Shop Now
                </Button>
              </div>
            </div>

            {/* Product Image - Enhanced for mobile visibility */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-full lg:max-w-md">
                <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm" />
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className="relative z-10 w-full h-full object-contain rounded-2xl"
                  loading="eager"
                />
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
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
