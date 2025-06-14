
import HeroSection from "../components/HeroSection";
import CategoryGrid from "../components/CategoryGrid";
import ProductGrid from "../components/ProductGrid";
import FeaturesRow from "../components/FeaturesRow";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <CategoryGrid />
        <ProductGrid />
        <FeaturesRow />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
