
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedProductSearch from "@/components/search/EnhancedProductSearch";

const Products = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const category = searchParams.get('category');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32 md:pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 
             category ? `${category} Products` : 
             'All Products'}
          </h1>
          <p className="text-gray-600">
            Discover our complete collection of premium electronics and accessories with enhanced shopping experience
          </p>
        </div>
        
        <EnhancedProductSearch />
      </main>
      <Footer />
    </div>
  );
};

export default Products;
