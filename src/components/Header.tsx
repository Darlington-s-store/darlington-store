
import { LogOut, ShoppingCart, Search, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/", active: true, color: "bg-red-700 text-white" },
  { label: "Products", href: "#products", active: false, color: "bg-yellow-400 text-red-900" },
  { label: "About", href: "#about", active: false },
  { label: "Contact", href: "#contact", active: false },
  { label: "Track Order", href: "#track", active: false }
];

export default function Header() {
  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <nav className="flex items-center justify-between px-8 py-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Store size={28} className="text-red-700" />
          <span className="font-bold text-lg md:text-xl text-gray-900">Darlington Store</span>
        </div>
        {/* Nav */}
        <ul className="flex items-center gap-2 md:gap-3">
          {navLinks.map((link, idx) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={cn(
                  "rounded px-4 py-2 font-medium transition-colors",
                  link.active ? "bg-red-700 text-white" : "",
                  link.color,
                  !link.active && !link.color ? "text-gray-700 hover:bg-gray-100" : ""
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        {/* Search/Cart/User section */}
        <div className="flex items-center gap-2">
          <div className="relative hidden md:flex">
            <input
              type="text"
              className="rounded-md bg-white pl-10 pr-3 py-2 border border-gray-200 focus:ring-2 focus:ring-red-600 focus:outline-none text-sm"
              placeholder="Search products..."
              style={{ minWidth: 200 }}
            />
            <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
          </div>
          <Button
            variant="ghost"
            className="rounded-full px-2 py-2"
            size="icon"
            aria-label="Cart"
          >
            <ShoppingCart className="text-gray-700" />
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
  );
}
