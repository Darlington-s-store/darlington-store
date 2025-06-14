
import { LogOut, ShoppingCart, Search, Store } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Cart from "./Cart";

const navLinks = [
  { label: "Home", href: "/", color: "bg-red-700 text-white" },
  { label: "Products", href: "/products", color: "bg-yellow-400 text-red-900" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Track Order", href: "/track" }
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartItemCount(totalItems);
    };

    updateCartCount();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      <header className="w-full border-b bg-white sticky top-0 z-50">
        <nav className="flex items-center justify-between px-8 py-4">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <Store size={28} className="text-red-700" />
            <span className="font-bold text-lg md:text-xl text-gray-900">Darlington Store</span>
          </Link>
          {/* Nav */}
          <ul className="flex items-center gap-2 md:gap-3">
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={cn(
                      "rounded px-4 py-2 font-medium transition-colors",
                      isActive ? "bg-red-700 text-white" : "",
                      link.color && !isActive ? link.color : "",
                      !isActive && !link.color ? "text-gray-700 hover:bg-gray-100" : ""
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* Search/Cart/User section */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative hidden md:flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-md bg-white pl-10 pr-3 py-2 border border-gray-200 focus:ring-2 focus:ring-red-600 focus:outline-none text-sm"
                placeholder="Search products..."
                style={{ minWidth: 200 }}
              />
              <button type="submit" className="absolute left-2 top-2.5 text-gray-400 hover:text-gray-600">
                <Search size={18} />
              </button>
            </form>
            <Button
              variant="ghost"
              className="rounded-full px-2 py-2 relative"
              size="icon"
              aria-label="Cart"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            <span className="hidden md:inline text-sm text-gray-700">Welcome, Rawlings Junior</span>
            <Button variant="outline" className="ml-1 flex items-center gap-1 border">
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>
        <div className="h-2 w-full bg-red-700" />
      </header>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
