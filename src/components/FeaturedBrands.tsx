import { useAppSettings } from "@/hooks/useAppSettings";

const brands = [
  {
    name: "Apple",
    logo: "https://images.unsplash.com/photo-1621768216002-5ac171876625?auto=format&fit=crop&w=120&q=80",
    products: "iPhone, iPad, MacBook, Apple Watch",
    featured: true
  },
  {
    name: "Samsung", 
    logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=120&q=80",
    products: "Galaxy Smartphones, Tablets, Watches",
    featured: true
  },
  {
    name: "Sony",
    logo: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=120&q=80",
    products: "PlayStation, Headphones, Audio",
    featured: true
  },
  {
    name: "HP",
    logo: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=120&q=80",
    products: "Laptops, Printers, Workstations",
    featured: false
  },
  {
    name: "Dell",
    logo: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=120&q=80",
    products: "Laptops, Desktops, Monitors",
    featured: false
  },
  {
    name: "ASUS",
    logo: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=120&q=80",
    products: "Gaming Laptops, Motherboards",
    featured: false
  },
  {
    name: "Microsoft",
    logo: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=120&q=80",
    products: "Xbox, Surface, Software",
    featured: true
  },
  {
    name: "Google",
    logo: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=120&q=80",
    products: "Pixel Phones, Nest Devices",
    featured: false
  }
];

const FeaturedBrands = () => {
  const { settings } = useAppSettings();

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
              key={brand.name} 
              className={`group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                brand.featured ? 'ring-2 ring-red-100' : ''
              }`}
            >
              <div className="text-center">
                <div className="mb-4 overflow-hidden rounded-xl">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-16 w-20 object-contain mx-auto grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                    onError={(e) => {
                      console.error(`Failed to load brand logo for ${brand.name}:`, e);
                      e.currentTarget.style.display = 'none';
                    }}
                    loading="lazy"
                  />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {brand.products}
                </p>
                {brand.featured && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Brand Stats */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-red-700 mb-2">50+</div>
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
