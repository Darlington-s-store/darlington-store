
import { useState } from "react";
import { ShoppingCart, Star, Filter, Search } from "lucide-react";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";

const allProducts = [
  {
    id: 1,
    name: "Sony PlayStation 5",
    desc: "Next-generation gaming console with 4K gaming capability",
    price: "₵3,800",
    brand: "Sony",
    rating: 4.5,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: 2,
    name: "Samsung 980 PRO 4TB NVMe",
    desc: "Ultra-high capacity M.2 NVMe SSD for professionals",
    price: "₵2,800",
    brand: "Samsung",
    rating: 4.5,
    category: "Storage",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: 3,
    name: "Samsung Galaxy Tab S9",
    desc: "Premium Android tablet with S Pen included",
    price: "₵4,500",
    brand: "Samsung",
    rating: 4.5,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: 4,
    name: "Lenovo Tab P11 Plus",
    desc: "Mid-range tablet perfect for entertainment and productivity",
    price: "₵1,800",
    brand: "Lenovo",
    rating: 4.5,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: 5,
    name: "MacBook Pro 16-inch",
    desc: "Powerful laptop for professionals and creators",
    price: "₵12,500",
    brand: "Apple",
    rating: 4.8,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: 6,
    name: "iPhone 15 Pro",
    desc: "Latest iPhone with titanium design and powerful A17 chip",
    price: "₵8,900",
    brand: "Apple",
    rating: 4.7,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=420&q=80",
  },
];

const categories = ["All", "Laptops", "Smartphones", "Tablets", "Gaming", "Storage"];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-600" size={20} />
              <span className="text-gray-600 font-medium">Category:</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-red-700 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md border hover:shadow-lg transition group flex flex-col justify-between"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-44 object-cover rounded-t-lg cursor-pointer"
                onClick={() => window.location.href = `/product/${product.id}`}
              />
              <div className="flex flex-col px-4 py-3 grow">
                <div className="font-semibold text-lg mb-1">{product.name}</div>
                <div className="text-gray-600 text-sm mb-2">{product.desc}</div>
                <div className="flex items-center justify-between mt-auto mb-1">
                  <div className="text-red-700 font-bold text-lg">{product.price}</div>
                  <div className="flex items-center text-yellow-500 text-base font-semibold ml-2">
                    <Star className="h-5 w-5 mr-1 fill-yellow-400 stroke-yellow-500" />
                    {product.rating}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">Brand: {product.brand}</div>
                <Button className="bg-red-700 hover:bg-red-800 text-white w-full mt-2 flex items-center justify-center gap-2 text-base font-medium">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
