
import { Truck, Shield, Headphones, CreditCard, RefreshCw, Award } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Free shipping on orders over ₵500 within Accra",
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure payment with advanced encryption",
      color: "text-green-600 bg-green-100"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support via phone & chat",
      color: "text-purple-600 bg-purple-100"
    },
    {
      icon: CreditCard,
      title: "Easy Returns",
      description: "Hassle-free returns within 30 days of purchase",
      color: "text-orange-600 bg-orange-100"
    },
    {
      icon: RefreshCw,
      title: "Quick Exchange",
      description: "Fast product exchange for defective items",
      color: "text-red-600 bg-red-100"
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "Authentic products with manufacturer warranty",
      color: "text-yellow-600 bg-yellow-100"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Why Choose Darlington Store?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best shopping experience through our comprehensive services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200"
              >
                <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
