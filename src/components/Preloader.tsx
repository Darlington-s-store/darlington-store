
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // Show preloader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-700 to-red-900 animate-fade-in">
      <div className="text-center">
        <div className="mb-8 animate-scale-in">
          <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-lg border border-white/20">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Darlington Store</h1>
          <p className="text-white/80 text-lg">Ghana's Premier Electronics Store</p>
        </div>
        <div className="w-64 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse" style={{ 
            animation: 'loading-bar 2s ease-in-out' 
          }}></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; }
          50% { width: 60%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Preloader;
