
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-sm">No image available</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 lg:space-y-4">
      {/* Main Image Display */}
      <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden group">
        <img
          src={images[selectedImage]}
          alt={`${productName} ${selectedImage + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />
        
        {/* Navigation arrows - only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation p-2 h-8 w-8 lg:h-10 lg:w-10"
            >
              <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation p-2 h-8 w-8 lg:h-10 lg:w-10"
            >
              <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs lg:text-sm">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation - only show if more than 1 image */}
      {images.length > 1 && (
        <div className="w-full">
          {images.length <= 4 ? (
            <div className="grid grid-cols-3 gap-2 lg:gap-3">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors touch-manipulation ${
                    selectedImage === index ? "border-red-700" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${productName} ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-colors touch-manipulation ${
                    selectedImage === index ? "border-red-700" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${productName} ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
