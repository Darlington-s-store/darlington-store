
import { useState, useEffect } from "react";
import { X, Gift, Zap, Truck } from "lucide-react";

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentPromo, setCurrentPromo] = useState(0);

  const promos = [
    {
      icon: Gift,
      text: "🎉 Grand Opening Sale: Up to 25% OFF on selected items!",
      highlight: "25% OFF",
      color: "from-red-600 to-red-700"
    },
    {
      icon: Truck,
      text: "🚛 FREE delivery within Accra for orders above ₵500",
      highlight: "FREE delivery",
      color: "from-green-600 to-green-700"
    },
    {
      icon: Zap,
      text: "⚡ Flash Deal: iPhone 15 Pro Max - Limited stock available!",
      highlight: "Flash Deal",
      color: "from-purple-600 to-purple-700"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentPromoData = promos[currentPromo];
  const IconComponent = currentPromoData.icon;

  return (
    <div className={`relative bg-gradient-to-r ${currentPromoData.color} text-white py-3 px-4 shadow-md`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <IconComponent className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm md:text-base font-medium text-center flex-1 animate-fade-in">
            {currentPromoData.text}
          </div>
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{ 
            width: `${((currentPromo + 1) / promos.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default PromoBanner;
