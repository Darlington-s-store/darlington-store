
import { Store, Users, Award, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useAppSettings } from "@/hooks/useAppSettings";

const About = () => {
  const { settings } = useAppSettings();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About {settings.site_name}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {settings.site_description}. We've been serving customers 
            with quality products and exceptional service since our founding.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              Founded with a vision to make premium electronics accessible to everyone in Ghana, 
              {settings.site_name} has grown from a small local shop to one of the most trusted electronics 
              retailers in the region.
            </p>
            <p className="mb-4">
              We believe that technology should enhance lives, and we're committed to providing 
              our customers with the latest gadgets, reliable service, and expert advice to help 
              them make informed decisions.
            </p>
            <p>
              Today, we continue to expand our product range and improve our services, always 
              keeping our customers' needs at the heart of everything we do.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Store className="w-12 h-12 text-red-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Products</h3>
            <p className="text-gray-600">We source only the best electronics from trusted brands worldwide.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="w-12 h-12 text-red-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
            <p className="text-gray-600">Your satisfaction is our priority. We're here to help every step of the way.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Award className="w-12 h-12 text-red-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Service</h3>
            <p className="text-gray-600">Our knowledgeable team provides expert advice and technical support.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Shield className="w-12 h-12 text-red-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Warranty & Support</h3>
            <p className="text-gray-600">All products come with comprehensive warranty and after-sales support.</p>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rawlings Junior</h3>
              <p className="text-red-700 font-medium mb-2">Founder & CEO</p>
              <p className="text-gray-600">Leading the vision and strategy of {settings.site_name} with over 10 years of experience in electronics retail.</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Mensah</h3>
              <p className="text-red-700 font-medium mb-2">Head of Customer Service</p>
              <p className="text-gray-600">Ensuring every customer receives exceptional service and support throughout their journey with us.</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kwame Asante</h3>
              <p className="text-red-700 font-medium mb-2">Technical Specialist</p>
              <p className="text-gray-600">Our tech expert who helps customers choose the right products and provides technical support.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;
