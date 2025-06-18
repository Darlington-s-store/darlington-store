
import { Star } from "lucide-react";
import ProductShowcase from "./ProductShowcase";

export default function TopRated() {
  return (
    <div className="bg-gray-50">
      <ProductShowcase
        title="Top Rated"
        subtitle="Customer favorites with excellent reviews"
        icon={Star}
        limit={8}
        gradient="from-yellow-600 to-orange-600"
      />
    </div>
  );
}
