
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Store, Users, Award, Globe } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Store, label: "Years in Business", value: "15+" },
    { icon: Users, label: "Happy Customers", value: "50K+" },
    { icon: Award, label: "Awards Won", value: "25+" },
    { icon: Globe, label: "Cities Served", value: "10+" }
  ];

  const team = [
    {
      name: "Darlington Asomani",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Sarah Johnson",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Michael Chen",
      role: "Tech Lead",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-red-600 to-red-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              About Darlington Store
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-3xl mx-auto">
              Ghana's premier electronics retailer, committed to bringing you the latest technology at unbeatable prices since 2009.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Founded in 2009 by Darlington Asomani, Darlington Store began as a small electronics shop in Kumasi Tanoso Market. What started as a vision to make quality electronics accessible to every Ghanaian has grown into one of the country's most trusted electronics retailers.
                  </p>
                  <p>
                    Over the years, we've expanded our reach across Ghana, serving customers from Accra to Tamale, and everywhere in between. Our commitment to authentic products, competitive pricing, and exceptional customer service has earned us the trust of over 50,000 satisfied customers.
                  </p>
                  <p>
                    Today, we continue to innovate and adapt, bringing you the latest in consumer electronics, from smartphones and laptops to gaming consoles and smart home devices.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b86e6d64bb6b?auto=format&fit=crop&w=600&q=80"
                  alt="Electronics store"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm md:text-base text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 md:py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-600">
                  To democratize access to cutting-edge technology across Ghana by providing authentic, high-quality electronics at competitive prices, backed by exceptional customer service and technical support.
                </p>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-600">
                  To become West Africa's leading electronics retailer, known for innovation, reliability, and customer satisfaction, while contributing to the digital transformation of our communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The passionate individuals behind Darlington Store's success
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-4 object-cover shadow-lg"
                  />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
