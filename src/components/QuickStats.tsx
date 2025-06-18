
import { Shield, Truck, Headphones, Award } from "lucide-react";

const stats = [
  {
    icon: Shield,
    number: "100%",
    label: "Authentic Products",
    color: "text-green-600",
    bg: "bg-green-50"
  },
  {
    icon: Truck,
    number: "24hrs",
    label: "Fast Delivery",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    icon: Headphones,
    number: "24/7",
    label: "Customer Support",
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    icon: Award,
    number: "2 Years",
    label: "Warranty",
    color: "text-orange-600",
    bg: "bg-orange-50"
  }
];

export default function QuickStats() {
  return (
    <section className="w-full py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-2xl p-6 text-center transition-transform hover:scale-105`}>
              <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
