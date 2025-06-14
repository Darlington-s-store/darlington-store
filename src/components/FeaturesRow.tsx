
import { Smartphone, ShieldCheck, Truck, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Mobile Money",
    desc: "MTN, Vodafone, AirtelTigo",
    iconColor: "text-green-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "Paystack Integration",
    iconColor: "text-red-600",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Across Ghana",
    iconColor: "text-yellow-500",
  },
  {
    icon: MessageCircle,
    title: "SMS Updates",
    desc: "Order Tracking",
    iconColor: "text-green-600",
  },
];

export default function FeaturesRow() {
  return (
    <section className="w-full bg-white py-8">
      <div className="max-w-6xl mx-auto flex flex-wrap md:flex-nowrap justify-center items-start gap-8">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col items-center flex-1 min-w-[160px]">
            <div className={`border-2 rounded-lg p-2 mb-2 ${f.iconColor} border-gray-200`}>
              <f.icon size={36} />
            </div>
            <div className="font-semibold text-md text-gray-800">{f.title}</div>
            <div className="text-gray-500 text-sm">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
