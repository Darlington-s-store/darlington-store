
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, ExternalLink } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;
  is_featured: boolean;
  display_order: number;
}

const FeaturedBrands = () => {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching brands:', error);
        return [];
      }
      
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted Brand Partners
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We partner with world's leading technology brands to bring you only authentic, 
              high-quality products with full warranty support.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8 items-center mb-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-md animate-pulse">
                <div className="text-center">
                  <div className="mb-4 overflow-hidden rounded-xl">
                    <div className="h-16 w-20 bg-gray-200 mx-auto rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) {
    return null; // Don't show the section if no brands
  }

  const featuredBrands = brands.filter(brand => brand.is_featured);
  const totalBrands = brands.length;
  const authenticProducts = Math.round(totalBrands * 0.95 * 100); // Simulated authentic products percentage

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted Brand Partners
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We partner with world's leading technology brands to bring you only authentic, 
            high-quality products with full warranty support.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8 items-center mb-12">
          {brands.map((brand) => (
            <div 
              key={brand.id} 
              className={`group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                brand.is_featured ? 'ring-2 ring-red-100' : ''
              }`}
              onClick={() => brand.website_url && window.open(brand.website_url, '_blank')}
            >
              <div className="text-center">
                <div className="mb-4 overflow-hidden rounded-xl">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="h-16 w-20 object-contain mx-auto grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                      onError={(e) => {
                        console.error(`Failed to load brand logo for ${brand.name}:`, e);
                        e.currentTarget.style.display = 'none';
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-16 w-20 bg-gray-200 rounded mx-auto flex items-center justify-center">
                      <span className="text-gray-400 text-xs">{brand.name[0]}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors">
                  {brand.name}
                </h3>
                {brand.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {brand.description}
                  </p>
                )}
                <div className="flex items-center justify-center space-x-2">
                  {brand.is_featured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </span>
                  )}
                  {brand.website_url && (
                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-red-600 transition-colors" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Stats */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-red-700 mb-2">{totalBrands}+</div>
              <div className="text-gray-600 font-medium">Global Brands</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-700 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Authentic Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-700 mb-2">2 Years</div>
              <div className="text-gray-600 font-medium">Warranty</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-700 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;
