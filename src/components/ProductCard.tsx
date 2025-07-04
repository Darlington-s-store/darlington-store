
import { useState } from "react";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    brand: string;
    stock_quantity: number;
    image_url: string;
    images?: any;
  };
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Parse images from the product with enhanced debugging
  const parseImages = (images: any): string[] => {
    if (Array.isArray(images)) {
      const parsed = images.map(img => String(img)).filter(img => img && img.trim() !== '');
      return parsed;
    }
    
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          const result = parsed.map(img => String(img)).filter(img => img && img.trim() !== '');
          return result;
        }
      } catch (error) {
        // Silent fail for JSON parse
      }
    }
    
    const fallback = [product.image_url].filter(Boolean);
    return fallback;
  };

  const images = parseImages(product.images);
  const currentImage = images[currentImageIndex] || product.image_url;

  const handleImageHover = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handleImageLeave = () => {
    setCurrentImageIndex(0);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
    setImageLoaded(true);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleAddToWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
      <div className="relative">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="w-full h-44 bg-gray-200 rounded-t-lg animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Main image */}
        <img 
          src={currentImage} 
          alt={product.name} 
          className={`w-full h-44 object-cover rounded-t-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
            !imageLoaded ? 'opacity-0 absolute' : 'opacity-100'
          }`}
          onClick={() => navigate(`/product/${product.id}`)}
          onMouseEnter={handleImageHover}
          onMouseLeave={handleImageLeave}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
        
        {/* Error state */}
        {imageError && imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">📷</div>
              <span className="text-sm">Image not available</span>
            </div>
          </div>
        )}
        
        {/* Wishlist button */}
        <button
          onClick={handleAddToWishlist}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-600 transition-colors" />
        </button>
        
        {/* Image indicator dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col px-4 py-3 grow">
        <div className="font-semibold text-lg mb-1 truncate" title={product.name}>
          {product.name}
        </div>
        <div className="text-gray-600 text-sm mb-2 h-10 overflow-hidden line-clamp-2">
          {product.description}
        </div>
        <div className="flex items-center justify-between mt-auto mb-1">
          <div className="text-red-700 font-bold text-lg">₵{product.price}</div>
          <div className="flex items-center text-yellow-500 text-base font-semibold ml-2">
            <Star className="h-5 w-5 mr-1 fill-yellow-400 stroke-yellow-500" />
            4.5
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Brand: {product.brand || 'Unbranded'}
        </div>
        <Button 
          onClick={handleAddToCart}
          className="bg-red-700 hover:bg-red-800 text-white w-full mt-2 flex items-center justify-center gap-2 text-base font-medium transition-colors"
          disabled={product.stock_quantity === 0}
        >
          <ShoppingCart className="w-5 h-5" />
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
