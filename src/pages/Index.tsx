
// Home page based closely on the provided UI screenshot

import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FeaturesRow from "../components/FeaturesRow";
import CategoryGrid from "../components/CategoryGrid";
import ProductGrid from "../components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex flex-col flex-1 w-full">
        <HeroSection />
        <FeaturesRow />
        <CategoryGrid />
        <ProductGrid />
      </main>
    </div>
  );
};

export default Index;
