
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function CategoryGrid() {
  const navigate = useNavigate();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  if (isLoading) {
    return (
      <section className="w-full py-10 px-2 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold mb-1">Shop by Category</h2>
          <p className="text-gray-500 text-base mb-4">
            Browse our extensive collection of premium electronics, carefully curated for the Ghanaian market.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg overflow-hidden shadow animate-pulse">
              <div className="w-full h-48 bg-gray-300" />
              <div className="py-3 px-4">
                <div className="h-6 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10 px-2 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold mb-1">Shop by Category</h2>
        <p className="text-gray-500 text-base mb-4">
          Browse our extensive collection of premium electronics, carefully curated for the Ghanaian market.
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition group cursor-pointer"
            onClick={() => handleCategoryClick(category.name)}
          >
            <img 
              src={category.image_url} 
              alt={category.name} 
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200" 
            />
            <div className="py-3 text-lg font-semibold group-hover:text-red-700 text-gray-800 text-center">
              {category.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
