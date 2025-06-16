
const brands = [
  {
    name: "Samsung",
    logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=120&q=80"
  },
  {
    name: "Apple", 
    logo: "https://images.unsplash.com/photo-1621768216002-5ac171876625?auto=format&fit=crop&w=120&q=80"
  },
  {
    name: "HP",
    logo: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=120&q=80"
  },
  {
    name: "Lenovo",
    logo: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=120&q=80"
  },
  {
    name: "Dell",
    logo: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=120&q=80"
  },
  {
    name: "Sony",
    logo: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=120&q=80"
  }
];

const FeaturedBrands = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Trusted Brands We Carry
          </h2>
          <p className="text-gray-600">
            Only authentic products from world's leading technology brands
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {brands.map((brand) => (
            <div key={brand.name} className="flex items-center justify-center">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-12 w-20 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;
