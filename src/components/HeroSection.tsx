
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="w-full bg-red-700 text-white py-16 px-6 flex flex-col md:flex-row items-center justify-between gap-10">
      <div className="flex-1 max-w-xl">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Ghana's Premier<br />Electronics Store
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8">
          Discover the latest laptops, smartphones, and accessories with fast delivery across Ghana. 
          Pay with Mobile Money, Paystack, or Bank Transfer.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Button size="lg" className="bg-white text-red-700 hover:bg-gray-100 font-semibold px-6 shadow"  >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Shop Now
          </Button>
          <input
            placeholder=" "
            disabled
            className="bg-white/70 text-black font-medium text-base rounded-md px-6 py-3 opacity-80 shadow"
            style={{ width: 170, cursor: "not-allowed" }}
          />
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="rounded-2xl bg-white/10 p-3 shadow-2xl border-2 border-white/10 backdrop-blur-lg">
          <img
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=560&q=80"
            alt="Ghana Electronics"
            className="rounded-xl object-cover w-[390px] h-[265px] md:w-[405px] md:h-[275px] shadow"
            style={{ background: "#eee" }}
          />
        </div>
      </div>
    </section>
  );
}
