
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const products = [
  {
    id: 1,
    name: "Sony PlayStation 5",
    desc: "Next-generation gaming console with 4K gaming capability",
    price: "₵3,800",
    brand: "Sony",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: 2,
    name: "Samsung 980 PRO 4TB NVMe",
    desc: "Ultra-high capacity M.2 NVMe SSD for professionals",
    price: "₵2,800",
    brand: "Samsung",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: 3,
    name: "Samsung Galaxy Tab S9",
    desc: "Premium Android tablet with S Pen included",
    price: "₵4,500",
    brand: "Samsung",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: 4,
    name: "Lenovo Tab P11 Plus",
    desc: "Mid-range tablet perfect for entertainment and productivity",
    price: "₵1,800",
    brand: "Lenovo",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=420&q=80",
  },
];

export default function ProductGrid() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    };
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message
    alert(`Added ${product.name} to cart!`);
  };

  const handleAddToWishlist = (product: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      rating: product.rating
    };

    const existingWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
    const isAlreadyInWishlist = existingWishlist.some((item: any) => item.id === product.id);

    if (isAlreadyInWishlist) {
      alert('Item is already in your wishlist!');
      return;
    }

    const updatedWishlist = [...existingWishlist, wishlistItem];
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
    alert(`Added ${product.name} to wishlist!`);
  };

  return (
    <section className="w-full py-10 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Most Popular Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-md border hover:shadow-lg transition group flex flex-col justify-between"
            >
              <div className="relative">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-44 object-cover rounded-t-lg cursor-pointer"
                  onClick={() => navigate(`/product/${p.id}`)}
                />
                <button
                  onClick={() => handleAddToWishlist(p)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                >
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-600" />
                </button>
              </div>
              <div className="flex flex-col px-4 py-3 grow">
                <div className="font-semibold text-lg mb-1">{p.name}</div>
                <div className="text-gray-600 text-sm mb-2">{p.desc}</div>
                <div className="flex items-center justify-between mt-auto mb-1">
                  <div className="text-red-700 font-bold text-lg">{p.price}</div>
                  <div className="flex items-center text-yellow-500 text-base font-semibold ml-2">
                    <Star className="h-5 w-5 mr-1 fill-yellow-400 stroke-yellow-500" />
                    {p.rating}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">Brand: {p.brand}</div>
                <Button 
                  onClick={() => handleAddToCart(p)}
                  className="bg-red-700 hover:bg-red-800 text-white w-full mt-2 flex items-center justify-center gap-2 text-base font-medium"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
