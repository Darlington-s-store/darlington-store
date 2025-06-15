
import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar = ({ isOpen, onToggle }: AdminSidebarProps) => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { id: "products", label: "Products", icon: Package, href: "/admin/products" },
    { id: "orders", label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { id: "customers", label: "Customers", icon: Users, href: "/admin/customers" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out",
        "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                  activeItem === item.id
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
