
import { TrendingUp } from "lucide-react";
import ProductShowcase from "./ProductShowcase";

export default function TrendingProducts() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50">
      <ProductShowcase
        title="Trending Now"
        subtitle="Most popular products this week"
        icon={TrendingUp}
        filterCondition={{ featured: true }}
        limit={8}
        gradient="from-purple-600 to-blue-600"
      />
    </div>
  );
}
