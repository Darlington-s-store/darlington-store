
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import CategoryBasedHomepage from "@/components/CategoryBasedHomepage";
import FeaturedBrands from "@/components/FeaturedBrands";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <CategoryBasedHomepage />
        <FeaturedBrands />
        <ServicesSection />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
