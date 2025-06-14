
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

  // Parse images from the product
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
  const currentImage = images[currentImageIndex] || product.image_url;

  const handleImageHover = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handleImageLeave = () => {
    setCurrentImageIndex(0);
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
    <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition group flex flex-col justify-between">
      <div className="relative">
        <img 
          src={currentImage} 
          alt={product.name} 
          className="w-full h-44 object-cover rounded-t-lg cursor-pointer transition-all duration-300"
          onClick={() => navigate(`/product/${product.id}`)}
          onMouseEnter={handleImageHover}
          onMouseLeave={handleImageLeave}
        />
        <button
          onClick={handleAddToWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
        >
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-600" />
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
        <div className="font-semibold text-lg mb-1">{product.name}</div>
        <div className="text-gray-600 text-sm mb-2">{product.description}</div>
        <div className="flex items-center justify-between mt-auto mb-1">
          <div className="text-red-700 font-bold text-lg">₵{product.price}</div>
          <div className="flex items-center text-yellow-500 text-base font-semibold ml-2">
            <Star className="h-5 w-5 mr-1 fill-yellow-400 stroke-yellow-500" />
            4.5
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-2">Brand: {product.brand}</div>
        <Button 
          onClick={handleAddToCart}
          className="bg-red-700 hover:bg-red-800 text-white w-full mt-2 flex items-center justify-center gap-2 text-base font-medium"
          disabled={product.stock_quantity === 0}
        >
          <ShoppingCart className="w-5 h-5" />
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
