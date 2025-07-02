
import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import CategoryShowcase from "../components/CategoryShowcase";
import DealsOfTheDay from "../components/DealsOfTheDay";
import NewArrivals from "../components/NewArrivals";
import TrendingProducts from "../components/TrendingProducts";
import TopRated from "../components/TopRated"; 
import QuickStats from "../components/QuickStats";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import PromoBanner from "../components/PromoBanner";
import FeaturedBrands from "../components/FeaturedBrands";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Preloader from "../components/Preloader";
import ServicesSection from "../components/ServicesSection";
import BlogPreview from "../components/BlogPreview";
import { useNotifications } from "@/hooks/useNotifications";

const Index = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  
  // Initialize notification system
  useNotifications();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showPreloader && <Preloader />}
      <div className={`min-h-screen bg-gray-50 overflow-x-hidden pb-20 md:pb-0 transition-opacity duration-500 ${showPreloader ? 'opacity-0' : 'opacity-100'}`}>
        <Header />
        <PromoBanner />
        <main className="w-full">
          <HeroSection />
          
          {/* Enhanced homepage sections */}
          <CategoryShowcase />
          <DealsOfTheDay />
          <NewArrivals />
          <QuickStats />
          <TrendingProducts />
          <TopRated />
          <ServicesSection />
          <FeaturedBrands />
          <BlogPreview />
          <Testimonials />
          <Newsletter />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
