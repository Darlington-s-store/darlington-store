
import { Zap } from "lucide-react";
import ProductShowcase from "./ProductShowcase";

export default function NewArrivals() {
  return (
    <ProductShowcase
      title="New Arrivals"
      subtitle="Fresh products just landed"
      icon={Zap}
      limit={8}
      gradient="from-green-600 to-emerald-600"
    />
  );
}
