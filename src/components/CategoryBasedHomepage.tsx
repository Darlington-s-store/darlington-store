
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FeaturedProductsSection from "./FeaturedProductsSection";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryBasedHomepage() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['homepage-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, description')
        .eq('is_active', true)
        .limit(6)
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <Skeleton className="h-8 w-64 mx-auto mb-2" />
                <Skeleton className="h-4 w-96 mx-auto" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="bg-white rounded-lg shadow-md border animate-pulse">
                    <div className="w-full h-44 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-5 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Featured Products Section */}
      <FeaturedProductsSection
        title="Featured Products"
        subtitle="Hand-picked selections just for you"
        featured={true}
        limit={8}
      />

      {/* Category-based Product Sections */}
      {categories.map((category) => (
        <FeaturedProductsSection
          key={category.id}
          title={category.name}
          subtitle={category.description || `Explore our ${category.name.toLowerCase()} collection`}
          categoryId={category.id}
          limit={4}
          showViewAll={true}
        />
      ))}

      {/* New Arrivals Section */}
      <FeaturedProductsSection
        title="New Arrivals"
        subtitle="Fresh products just landed"
        limit={8}
      />
    </div>
  );
}
