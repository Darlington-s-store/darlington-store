
import { Gift, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-yellow-400 to-orange-500 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="bg-white/20 p-3 rounded-full">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              Limited Time Offer!
            </h3>
            <p className="text-white/90 text-lg">
              Get 15% off on all laptops + Free delivery across Ghana
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Ends in 3 days!</span>
          </div>
          <Button 
            onClick={() => navigate('/products?category=Laptops')}
            className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-6 py-3"
          >
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
