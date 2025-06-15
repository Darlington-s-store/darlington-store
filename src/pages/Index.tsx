
import HeroSection from "../components/HeroSection";
import CategoryGrid from "../components/CategoryGrid";
import ProductGrid from "../components/ProductGrid";
import FeaturesRow from "../components/FeaturesRow";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden pb-20 md:pb-0">
      <Header />
      <main className="w-full pt-[72px]">
        <HeroSection />
        <div className="px-4 md:px-6 lg:px-8 space-y-8 md:space-y-12 py-8">
          <CategoryGrid />
          <ProductGrid />
          <FeaturesRow />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
