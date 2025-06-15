
import { ShoppingCart, Search, Store, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Cart from "./Cart";
import UserMenu from "./UserMenu";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      setIsMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full border-b bg-white sticky top-0 z-50 shadow-sm">
        {/* Desktop Header */}
        <nav className="hidden md:flex items-center justify-between px-4 lg:px-8 py-4">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <Store size={28} className="text-red-700" />
            <span className="font-bold text-lg lg:text-xl text-gray-900">Darlington Store</span>
          </Link>
          
          {/* Nav Links */}
          <ul className="flex items-center gap-2 lg:gap-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={cn(
                      "rounded px-3 lg:px-4 py-2 font-medium transition-colors text-sm lg:text-base",
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
            <form onSubmit={handleSearch} className="relative flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-md bg-white pl-10 pr-3 py-2 border border-gray-200 focus:ring-2 focus:ring-red-600 focus:outline-none text-sm w-48 lg:w-64"
                placeholder="Search products..."
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
            
            <UserMenu />
          </div>
        </nav>

        {/* Mobile Header */}
        <nav className="md:hidden flex items-center justify-between px-4 py-3 relative bg-white">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 z-50"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <Store size={24} className="text-red-700" />
            <span className="font-bold text-lg text-gray-900">Darlington Store</span>
          </Link>

          {/* User Menu Only - Cart moved to bottom */}
          <div className="flex items-center gap-1 relative z-50">
            <UserMenu />
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Background overlay */}
            <div 
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={closeMobileMenu}
            />
            {/* Menu content */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b shadow-lg z-40 pt-16">
              <div className="px-4 py-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md bg-white pl-10 pr-3 py-2 border border-gray-200 focus:ring-2 focus:ring-red-600 focus:outline-none text-sm"
                    placeholder="Search products..."
                  />
                  <button type="submit" className="absolute left-2 top-2.5 text-gray-400 hover:text-gray-600">
                    <Search size={18} />
                  </button>
                </form>

                {/* Mobile Navigation Links */}
                <nav className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.href;
                    return (
                      <Link
                        key={link.label}
                        to={link.href}
                        onClick={closeMobileMenu}
                        className={cn(
                          "block rounded px-4 py-3 font-medium transition-colors text-base",
                          isActive ? "bg-red-700 text-white" : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </>
        )}

        <div className="h-2 w-full bg-red-700" />
      </header>

      {/* Mobile Bottom Cart - Fixed at bottom of screen */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="flex justify-center py-3">
          <Button
            variant="ghost"
            className="rounded-full p-3 relative bg-red-700 hover:bg-red-800"
            size="icon"
            aria-label="Cart"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={24} className="text-white" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
