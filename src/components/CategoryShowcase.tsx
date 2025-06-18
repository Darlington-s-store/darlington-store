
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Smartphone, Laptop, Tablet, Headphones, Watch, Gamepad2, Cable, Monitor } from "lucide-react";

const categoryIcons = {
  'Smartphones': Smartphone,
  'Laptops': Laptop,
  'Tablets': Tablet,
  'Audio': Headphones,
  'Wearables': Watch,
  'Gaming': Gamepad2,
  'Accessories': Cable,
  'Monitors': Monitor,
};

export default function CategoryShowcase() {
  const navigate = useNavigate();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['category-showcase'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')
        .limit(8);
      
      if (error) throw error;
      return data;
    }
  });

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  if (isLoading) {
    return (
      <section className="w-full py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-center animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-gray-600">Find exactly what you're looking for</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Smartphone;
            
            return (
              <div 
                key={category.id} 
                className="group bg-gray-50 hover:bg-red-50 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-md"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-red-600 transition-colors">
                    <IconComponent className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
